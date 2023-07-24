import * as React from "react";

export interface UseAsyncResult<TResult, TError = Error> {
  /**
   * Result of the async operation.
   */
  result?: TResult;

  /**
   * Caught error if the async operation failed.
   */
  error?: TError;

  /**
   * True if the operation has not been completed and is currently in progress.
   * Note that this is false when updating without clearing the previous data.
   * This is a shortcut for checking: inProgress && !result && !error
   */
  loading?: boolean;

  /**
   * True if the async operation is currently in progress
   */
  inProgress?: boolean;

  /**
   * Rerun the async operation and update the result once complete
   *
   * @param options Update options
   *
   * @returns Promise that resolves when the async operation is complete
   */
  update: (options?: IUseAsyncResultUpdateOptions) => Promise<{ result?: TResult; error?: TError }>;
}

export interface IUseAsyncResultUpdateOptions {
    /**
     * If true, the previous result and error will be cleared while the update operation is in progress.
     */
    clearPreviousData?: boolean;

    /**
     * If true (the default), the async operation will be executed even if it is disabled
     */
    ignoreDisabled?: boolean;
}

export interface UseAsyncOptions {
  /**
   * If true, the async operation will not be executed by the useAsync call.
   * It can still be invoked from the update method of the result.
   */
  disabled?: boolean;

  /**
   * Debounce time in milliseconds. If specified, the operation will not be executed until this amount of time has passed
   * since the last time the operation was executed.
   */
  debounce?: number;
}

export interface UseAsyncOperationContext {
  /**
   * If true, the async operation is being updated (via update method)
   */
  updating?: boolean;

  /**
   * If true, the async operation has been canceled (via unmount or re-render with different async operation)
   */
  canceled?: boolean;
}

/**
 * Hook that executes an async function and returns the result, error, and loading state. Updates state when the async function is complete.
 *
 * @param asyncOperation An asynchronous operation to execute
 * @param deps React dependencies that will trigger a re-execution of the async function
 * @param options Hook options such as to disable execution of the operation
 * @returns An object containing the result, error, and loading state of the async operation
 */
export function useAsync<TResult, TDeps extends React.DependencyList, TError = Error>(
  asyncOperation: (...args: TDeps) => Promise<TResult>,
  deps: TDeps,
  options?: UseAsyncOptions
): UseAsyncResult<TResult, TError> {
    return useAsyncWithContext(() => asyncOperation(...deps), deps, options);
}

/**
 * Hook that executes an async function and returns the result, error, and loading state. Updates state when the async function is complete.
 * The asyncOperation for this hook is passed a context object that contains information about the current operation like whether it has been canceled or is being updated.
 *
 * @param asyncOperation An asynchronous operation to execute
 * @param deps React dependencies that will trigger a re-execution of the async function
 * @param options Hook options such as to disable execution of the operation
 * @returns An object containing the result, error, and loading state of the async operation
 */
export function useAsyncWithContext<TResult, TError = Error>(
  asyncOperation: (context: UseAsyncOperationContext) => Promise<TResult>,
  deps: React.DependencyList,
  options: UseAsyncOptions = {}
): UseAsyncResult<TResult, TError> {
  const { disabled = false } = options;
  const [, setIteration] = React.useState(0);

  const stateRef = React.useRef<{
    asyncOperation?: (context: UseAsyncOperationContext) => Promise<TResult>;
    lastExecuteOperation?: (updating?: boolean) => Promise<{ result?: TResult; error?: TError; }>;
    lastOperationContext?: UseAsyncOperationContext;
    executeIndex: number;
    inProgress?: boolean;
    result?: TResult;
    error?: TError;
    unmounted?: boolean;
  }>();
  if (!stateRef.current) {
    stateRef.current = { executeIndex: 0 };
  }
  const state = stateRef.current;

  state.asyncOperation = options.debounce ? async (context: UseAsyncOperationContext) => {
    await delay(options.debounce);
    if (!context.canceled) {
        return asyncOperation(context);
    } else {
        throw new Error("Debounced operation canceled");
    }
  } : asyncOperation;

  function setResult(executeIndex: number, result: TResult | undefined, error: TError | undefined) {
    if (state.executeIndex === executeIndex && !state.unmounted) {
      state.result = result;
      state.error = error;
      state.inProgress = false;
      state.lastOperationContext = undefined;
      setIteration((i) => i + 1);
    }
  }

  function clearPreviousOperation(clearResult: boolean) {
    if (clearResult) {
      state.result = undefined;
      state.error = undefined;
    }

    // Cancel prior operation
    if (state.lastOperationContext) {
      state.lastOperationContext.canceled = true;
    }

    state.inProgress = false;
    state.lastOperationContext = undefined;
  }

  // Memoize the operation based on the supplied dependencies and the disabled state
  const executeOperation = React.useCallback(
    (updating: boolean): Promise<{ result?: TResult; error?: TError; }> => {
      const executeIndex = ++state.executeIndex;
      state.inProgress = true;
      state.lastOperationContext = { updating };

      return state.asyncOperation(state.lastOperationContext).then(
        (result) => {
          setResult(executeIndex, result, undefined);
          return { result };
        },
        (error) => {
          setResult(executeIndex, undefined, error);
          return { error };
        }
      );
    },
    [...deps, disabled]
  );

  // Memoize a update operation based on executeOperation
  const update = React.useCallback(
    async (options: IUseAsyncResultUpdateOptions = {}) => {
      const { clearPreviousData, ignoreDisabled = true } = options;
      const prevLoading = state.inProgress;
      clearPreviousOperation(clearPreviousData);

      if ((!disabled || ignoreDisabled) && !state.unmounted) {
        if (!prevLoading) {
          // We need to update the state of the hook to trigger a re-render with loading true
          state.inProgress = true;
          setIteration((i) => i + 1);
        }
        return executeOperation(true);
      }

      return {};
    },
    [executeOperation, disabled]
  );

  // If the operation is new, then execute it
  if (state.lastExecuteOperation !== executeOperation) {
    state.lastExecuteOperation = executeOperation;

    clearPreviousOperation(true);
    if (!disabled) {
      executeOperation(false);
    }
  }

  // Mark when we've been unmounted so that we can ignore any async operations that complete after unmount
  React.useEffect(() => {
    return () => {
      state.unmounted = true;
      if (state.lastOperationContext) {
        state.lastOperationContext.canceled = true;
      }
    };
  }, []);

  return React.useMemo(
    () => ({
      error: state.error,
      inProgress: Boolean(state.inProgress),
      loading: Boolean(state.inProgress && !state.result && !state.error),
      result: state.result,
      update,
    }),
    [state.error, state.inProgress, state.result, update]
  );
}

async function delay(delayTimeMs: number): Promise<void> {
    return new Promise((resolve) => {
        window.setTimeout(resolve, delayTimeMs);
    });
}
