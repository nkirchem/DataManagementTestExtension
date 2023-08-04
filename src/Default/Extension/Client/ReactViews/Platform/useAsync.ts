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
   * Note that this is false when refreshing without clearing the previous data.
   * This is a shortcut for checking: inProgress && !result && !error
   */
  loading: boolean;

  /**
   * True if the async operation has completed (successfully or not).
   * This is reset when refresh is called with the `clearPreviousData` option.
   */
  completed: boolean;

  /**
   * True if the async operation is currently in progress
   */
  inProgress: boolean;

  /**
   * Rerun the async operation and update the result once complete
   *
   * @param options Refresh options
   * @returns Promise that resolves when the async operation is complete
   */
  refresh: (options?: IUseAsyncResultRefreshOptions) => Promise<{ result?: TResult; error?: TError }>;
}

export interface IUseAsyncResultRefreshOptions {
  /**
   * If true, the previous result and error will be cleared while the refresh operation is in progress.
   */
  clearPreviousData?: boolean;

  /**
   * If true, the async operation will be not be executed if the hook is in the disabled state - and the refresh operation will no-op.
   * The default behavior (if false or unspecified) is to always execute the async operation when refresh is called, even if the hook
   * is in the disabled state.
   */
  skipIfDisabled?: boolean;
}

export interface UseAsyncOptions {
  /**
   * If true, the async operation will not be executed by the useAsync call.
   * It can still be invoked from the refresh method of the result.
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
   * If true, the async operation is being refreshed (via refresh method)
   */
  refreshing?: boolean;

  /**
   * If true, the async operation has been canceled (via unmount or re-render with different async operation)
   */
  canceled?: boolean;
}

export interface UseOperationResult<TResult, TArgs extends ReadonlyArray<any>, TError = Error> extends Omit<UseAsyncResult<TResult, TError>, "loading" | "refresh"> {
  /**
   * Execute the async operation and update the result once complete
   *
   * @returns Promise that resolves when the async operation is complete
   */
  execute: (...args: TArgs) => Promise<{ result?: TResult; error?: TError }>;
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
  asyncOperation: (...args: TDeps) => Promise<TResult> | TResult,
  deps: TDeps,
  options?: UseAsyncOptions
): UseAsyncResult<TResult, TError> {
  return useAsyncWithContext(() => asyncOperation(...deps), deps, options);
}

/**
* Hook that takes an async function and returns the operation (execute) along with the result of the current execution.
*
* @param asyncOperation An asynchronous operation to execute
* @param options Hook options such as to disable execution of the operation
* @returns An object containing the result, error, and loading state of the async operation
*/
export function useOperation<TResult, TArgs extends ReadonlyArray<any>, TError = Error>(
  asyncOperation: (...args: TArgs) => Promise<TResult> | TResult,
  options?: Pick<UseAsyncOptions, "debounce">
): UseOperationResult<TResult, TArgs, TError> {
  let executionArgs: TArgs;
  const operation = async () => {
      return asyncOperation(...executionArgs);
  };
  const { completed, error, inProgress, refresh, result } = useAsyncWithContext<TResult, TError>(operation, [], { ...options, disabled: true });
  return React.useMemo(
      () => ({
          completed,
          error,
          inProgress,
          result,
          execute: (...args: TArgs) => {
              executionArgs = args;
              return refresh({ clearPreviousData: true });
          },
      }),
      [completed, error, inProgress, result]
  );
}

/**
* Hook that executes an async function and returns the result, error, and loading state. Updates state when the async function is complete.
* The asyncOperation for this hook is passed a context object that contains information about the current operation like whether it has been canceled or is being refreshed.
*
* @param asyncOperation An asynchronous operation to execute
* @param deps React dependencies that will trigger a re-execution of the async function
* @param options Hook options such as to disable execution of the operation
* @returns An object containing the result, error, and loading state of the async operation
*/
export function useAsyncWithContext<TResult, TError = Error>(
  asyncOperation: (context: UseAsyncOperationContext) => Promise<TResult> | TResult,
  deps: React.DependencyList,
  options: UseAsyncOptions = {}
): UseAsyncResult<TResult, TError> {
  const { disabled = false } = options;
  const [, setIteration] = React.useState(0);

  const stateRef = React.useRef<{
      asyncOperation?: (context: UseAsyncOperationContext) => Promise<TResult> | TResult;
      lastExecuteOperation?: (refreshing?: boolean) => Promise<{ result?: TResult; error?: TError }>;
      lastExecutionDisabled?: boolean;
      lastOperationContext?: UseAsyncOperationContext;
      executeIndex: number;
      inProgress?: boolean;
      completed: boolean;
      result?: TResult;
      error?: TError;
      unmounted?: boolean;
  }>();
  if (!stateRef.current) {
      stateRef.current = { executeIndex: 0, completed: false };
  }
  const state = stateRef.current;

  state.asyncOperation = options.debounce
      ? async (context: UseAsyncOperationContext) => {
            await delay(options.debounce);
            if (!context.canceled) {
                return asyncOperation(context);
            } else {
                throw new Error("Debounced operation canceled");
            }
        }
      : asyncOperation;

  function setResult(executeIndex: number, result: TResult | undefined, error: TError | undefined, updateState: boolean) {
      if (state.executeIndex === executeIndex && !state.unmounted) {
          state.result = result;
          state.error = error;
          state.completed = true;
          state.inProgress = false;
          state.lastOperationContext = undefined;
          if (updateState) {
              setIteration((i) => i + 1);
          }
      }
  }

  function clearPreviousOperation(clearResult: boolean) {
      if (clearResult) {
          state.completed = false;
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

  // Memoize the operation based on the supplied dependencies
  const executeOperation = React.useCallback(
      (refreshing: boolean): Promise<{ result?: TResult; error?: TError }> => {
          const executeIndex = ++state.executeIndex;
          state.inProgress = true;
          state.lastOperationContext = { refreshing };

          let result: TResult | Promise<TResult>;
          try {
              result = state.asyncOperation(state.lastOperationContext);
          } catch (error) {
              setResult(executeIndex, undefined, error, false);
              return Promise.resolve({ error });
          }

          if (isPromise(result)) {
              return result.then(
                  (result) => {
                      setResult(executeIndex, result, undefined, true);
                      return { result };
                  },
                  (error) => {
                      setResult(executeIndex, undefined, error, true);
                      return { error };
                  }
              );
          } else {
              setResult(executeIndex, result, undefined, false);
              return Promise.resolve({ result });
          }
      },
      [...deps]
  );

  // Memoize a refresh operation based on executeOperation
  const refresh = React.useCallback(
      async (options: IUseAsyncResultRefreshOptions = {}) => {
          const { clearPreviousData, skipIfDisabled } = options;

          if (!state.unmounted) {
              // Update state with new loading status
              const runOperation = !disabled || !skipIfDisabled;
              clearPreviousOperation(clearPreviousData);
              state.inProgress = runOperation;
              setIteration((i) => i + 1);

              if (runOperation) {
                  return executeOperation(true);
              }
          }

          return {};
      },
      [executeOperation, disabled]
  );

  // If the operation is new (deps have changed), then clear the result and execute the operation
  if (state.lastExecuteOperation !== executeOperation) {
      state.lastExecuteOperation = executeOperation;

      clearPreviousOperation(true);
      if (!disabled) {
          executeOperation(false);
      }
  } else if (!disabled && state.lastExecutionDisabled && !state.completed && !state.inProgress) {
      // If we transitioned from disabled to enabled and we haven't yet started the operation, do so now
      executeOperation(false);
  }

  state.lastExecutionDisabled = disabled;

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
          completed: state.completed,
          result: state.result,
          refresh,
      }),
      [state.completed, state.error, state.inProgress, state.result, refresh]
  );
}

function isPromise<T>(value: Promise<T> | T): value is Promise<T> {
  return typeof (value as Promise<T>)?.then === "function";
}

async function delay(delayTimeMs: number): Promise<void> {
  return new Promise((resolve) => {
      window.setTimeout(resolve, delayTimeMs);
  });
}
