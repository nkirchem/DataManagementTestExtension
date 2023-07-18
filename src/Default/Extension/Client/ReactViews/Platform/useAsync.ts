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
     * True if the async operation is in progress
     */
    loading?: boolean;

    /**
     * Rerun the async operation and update the result once complete
     *
     * @param clearPreviousData If true, the previous result and error will be cleared
     *
     * @returns Promise that resolves when the async operation is complete
     */
    refresh: (clearPreviousData?: boolean) => Promise<TResult>;
}

export interface IUseAsyncOptions {
    /**
     * If true, the async operation will not be executed
     */
    disabled?: boolean;
}

export interface IAsyncFuncArgs {
    /**
     * If true, the async operation is being refreshed
     */
    refreshing?: boolean;

    /**
     * If true, the async operation has been canceled (via unmount or re-render with different async operation)
     */
    canceled?: boolean;
}

/**
 * Hook that executes an async function and returns the result, error, and loading state. Updates state when the async function is complete.
 * 
 * @param asyncFunc An asynchronous operation to execute
 * @param deps React dependencies that will trigger a re-execution of the async function
 * @param options Hook options such as to disable execution of the operation
 * @returns An object containing the result, error, and loading state of the async operation
 */
export function useAsync<TResult, TError = Error>(asyncFunc: (args: IAsyncFuncArgs) => Promise<TResult>, deps: React.DependencyList, options: IUseAsyncOptions = {}): UseAsyncResult<TResult, TError> {
    const { disabled = false } = options;
    const [, setIteration] = React.useState(0);

    const stateRef = React.useRef<{
        asyncFunc?: (args: IAsyncFuncArgs) => Promise<TResult>;
        lastExecuteOperation?: (refreshing?: boolean) => Promise<TResult>;
        lastExecuteArgs?: IAsyncFuncArgs;
        executeIndex: number;
        loading?: boolean;
        result?: TResult;
        error?: TError;
        unmounted?: boolean;
    }>();
    if (!stateRef.current) {
        stateRef.current = { executeIndex: 0 };
    }
    const state = stateRef.current;

    state.asyncFunc = asyncFunc;

    function setResult(executeIndex: number, result: TResult | undefined, error: TError | undefined) {
        if (state.executeIndex === executeIndex && !state.unmounted) {
            state.result = result;
            state.error = error;
            state.loading = false;
            state.lastExecuteArgs = undefined;
            setIteration(i => i + 1);
        }
    };

    function clearPreviousOperation(clearResult: boolean) {
        if (clearResult) {
            state.result = undefined;
            state.error = undefined;
        }

        // Cancel prior operation
        if (state.lastExecuteArgs) {
            state.lastExecuteArgs.canceled = true;
        }

        state.loading = false;
        state.lastExecuteArgs = undefined;
    };

    // Memoize the operation based on the supplied dependencies and the disabled state
    const executeOperation = React.useCallback((refreshing: boolean) => {
        const args: IAsyncFuncArgs = { refreshing };

        const executeIndex = ++state.executeIndex;
        state.loading = true;
        state.lastExecuteArgs = args;

        return state.asyncFunc(args).then(result => {
            setResult(executeIndex, result, undefined);
            return result;
        }, error => {
            setResult(executeIndex, undefined, error);
            return undefined;
        });
    }, [...deps, disabled]);

    // Memoize a refresh operation based on executeOperation
    const refresh = React.useCallback(async (clearPreviousData: boolean) => {
        const prevLoading = state.loading;
        clearPreviousOperation(clearPreviousData);

        if (!disabled && !state.unmounted) {
            if (!prevLoading) {
                // We need to update the state of the hook to trigger a re-render with loading true
                state.loading = true;
                setIteration(i => i + 1);
            }
            return executeOperation(true);
        }
    }, [executeOperation, disabled]);

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
        };
    }, []);

    return React.useMemo(() => ({
        error: state.error,
        loading: state.loading,
        result: state.result,
        refresh
    }), [state.error, state.loading, state.result, refresh]);
}
