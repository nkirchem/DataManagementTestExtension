import { act, renderHook } from "@testing-library/react-hooks";
import { UseAsyncOperationContext, useAsync, useAsyncWithContext, useOperation } from "../Platform/useAsync";

describe("useAsync", () => {
  test("deps are passed in through args", () => {
      let args: any[] = [];
      renderHook(() =>
          useAsync(
              (a1, a2, a3) => {
                  args = [a1, a2, a3];
                  return new Promise(() => { });
              },
              ["arg1", false, 123]
          )
      );
      expect(args).toEqual(["arg1", false, 123]);
  });

  test("returns successful async result", async () => {
      const { result, rerender } = renderHook(() => useAsync(() => Promise.resolve("text"), []));
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.completed).toBe(false);
      expect(result.current?.loading).toBe(true);
      expect(result.current?.inProgress).toBe(true);

      await asyncAction(rerender);

      expect(result.current?.result).toEqual("text");
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.completed).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
  });

  test("returns rejected async result", async () => {
      const { result, rerender } = renderHook(() => useAsync(() => Promise.reject("text"), []));
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.completed).toBe(false);
      expect(result.current?.loading).toBe(true);
      expect(result.current?.inProgress).toBe(true);

      await asyncAction(rerender);

      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toEqual("text");
      expect(result.current?.completed).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
  });

  test("returns synchronous value", () => {
      const { result } = renderHook(() => useAsync(() => "text", []));
      expect(result.current?.result).toEqual("text");
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.completed).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
  });

  test("returns synchronous undefined", () => {
      const { result } = renderHook(() => useAsync(() => undefined, []));
      expect(result.current?.result).toEqual(undefined);
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.completed).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
  });

  test("operation throws synchronous exception", () => {
      const { result } = renderHook(() => useAsync(() => { throw new Error("test error"); }, []));
      expect(result.current?.result).toEqual(undefined);
      expect(result.current?.error?.message).toEqual("test error");
      expect(result.current?.completed).toBe(true);
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
  });

  test("stale operation is cancelled and its result is ignored", async () => {
      const deferred1 = defer();
      const deferred2 = defer();
      let promise = deferred1.promise;

      const { result, rerender } = renderHook(() => useAsync(() => promise, [promise]));
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.inProgress).toBe(true);

      promise = deferred2.promise;
      await asyncAction(rerender);

      await asyncAction(() => { deferred1.resolve("text1"); });

      expect(result.current?.result).toBeUndefined();
      expect(result.current?.inProgress).toBe(true);

      await asyncAction(() => { deferred2.resolve("text2"); });

      expect(result.current?.result).toEqual("text2");
      expect(result.current?.inProgress).toBe(false);
  });

  test("hook does not run while disabled, then runs once enabled", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      let disabled = true;
      const { result, rerender } = renderHook(() => useAsync(mock, [], { disabled }));
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);

      await asyncAction(rerender);

      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toBeUndefined();
      expect(result.current?.loading).toBe(false);
      expect(result.current?.inProgress).toBe(false);
      expect(mock).toHaveBeenCalledTimes(0);

      // Enable the hook and rerun, should invoke the async operation
      disabled = false;
      await asyncAction(rerender);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(result.current?.result).toEqual("text");
  });

  test("async operation is not invoked again unless deps change", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      let prop1 = "value1";
      let lastArgument = "";

      const { result, rerender } = renderHook(() =>
          useAsync(
              (arg1) => {
                  lastArgument = arg1;
                  return mock();
              },
              [prop1]
          )
      );

      expect(lastArgument).toEqual("value1");
      expect(mock).toHaveBeenCalledTimes(1);

      await asyncAction(rerender);
      await asyncAction(rerender);

      expect(lastArgument).toEqual("value1");
      expect(mock).toHaveBeenCalledTimes(1);
      expect(result.current?.result).toEqual("text");

      prop1 = "value2";
      await asyncAction(rerender);
      expect(lastArgument).toEqual("value2");
      expect(mock).toHaveBeenCalledTimes(2);
  });

  test("invoking refresh re-runs a completed result", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      let context: UseAsyncOperationContext;
      const { result, rerender } = renderHook(() =>
          useAsyncWithContext((ctx) => {
              context = ctx;
              return mock();
          }, [])
      );
      await asyncAction(rerender);
      expect(result.current?.result).toEqual("text");
      expect(context.refreshing).toBe(false);
      expect(mock).toHaveBeenCalledTimes(1);

      // Refresh without clearing previous result
      mock.mockResolvedValue("text2");
      act(() => {
          result.current?.refresh();
      });
      expect(result.current?.result).toEqual("text");
      expect(result.current?.loading).toEqual(false);
      expect(result.current?.inProgress).toEqual(true);
      expect(context.refreshing).toBe(true);
      expect(mock).toHaveBeenCalledTimes(2);

      await asyncAction(rerender);
      expect(result.current?.result).toEqual("text2");
      expect(result.current?.loading).toEqual(false);
      expect(result.current?.inProgress).toEqual(false);
  });

  test("invoking refresh with clearPreviousData removes a prior result", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      let context: UseAsyncOperationContext;
      const { result, rerender } = renderHook(() =>
          useAsyncWithContext((ctx) => {
              context = ctx;
              return mock();
          }, [])
      );
      await asyncAction(rerender);
      expect(result.current?.result).toEqual("text");
      expect(context.refreshing).toBe(false);
      expect(mock).toHaveBeenCalledTimes(1);

      // Refresh without clearing previous result
      mock.mockResolvedValue("text2");
      act(() => {
          result.current?.refresh({ clearPreviousData: true });
      });
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.loading).toEqual(true);
      expect(result.current?.inProgress).toEqual(true);
      expect(context.refreshing).toBe(true);
      expect(mock).toHaveBeenCalledTimes(2);

      await asyncAction(rerender);
      expect(result.current?.result).toEqual("text2");
      expect(result.current?.loading).toEqual(false);
      expect(result.current?.inProgress).toEqual(false);
  });

  test("refresh can run a disabled operation when skipIfDisabled is false", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      const { result, rerender } = renderHook(() => useAsync(mock, [], { disabled: true }));
      await asyncAction(rerender);
      expect(mock).toHaveBeenCalledTimes(0);

      // Refresh with skipIfDisabled should no-op
      act(() => {
          result.current?.refresh({ skipIfDisabled: true });
      });
      await asyncAction(rerender);
      expect(mock).toHaveBeenCalledTimes(0);

      // Refresh without skipIfDisabled should run the operation
      act(() => {
          result.current?.refresh({ skipIfDisabled: false });
      });
      await asyncAction(rerender);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(result.current?.result).toEqual("text");
  });

  test("debounce only runs the operation after the interval", async () => {
      jest.useFakeTimers();

      const mock = jest.fn().mockResolvedValue("text");
      let depValue = 1;
      const { result, rerender } = renderHook(() => useAsync(mock, [depValue], { debounce: 100 }));
      await asyncAction(rerender);

      depValue = 2;
      await asyncAction(rerender);

      depValue = 3;
      await asyncAction(rerender);

      expect(mock).toHaveBeenCalledTimes(0);
      expect(result.current?.result).toBeUndefined();

      await asyncAction(() => {
          jest.advanceTimersByTime(101);
      });

      expect(mock).toHaveBeenCalledTimes(1);
      await asyncAction(rerender);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(result.current?.result).toEqual("text");
  });

  test("unmount with an incomplete operation", async () => {
      const deferred = defer();
      let context: UseAsyncOperationContext;
      const { result, rerender, unmount } = renderHook(() =>
          useAsyncWithContext((ctx) => {
              context = ctx;
              return deferred.promise;
          }, [])
      );
      await asyncAction(rerender);

      expect(result.current?.result).toBeUndefined();
      expect(result.current?.inProgress).toBe(true);
      expect(context.canceled).toBeFalsy();

      act(() => {
          unmount();
      });

      expect(result.current?.result).toBeUndefined();
      expect(context.canceled).toBe(true);
  });
});

describe("useOperation", () => {
  test("invoking operation mutates the state of the result", async () => {
      const mock = jest.fn().mockResolvedValue("text");
      const { result } = renderHook(() => useOperation(mock));
      expect(result.current?.completed).toBe(false);
      expect(result.current?.inProgress).toBe(false);
      expect(result.current?.result).toBeUndefined();
      expect(result.current?.error).toBeUndefined();

      await act(async () => {
          await result.current.execute("test1", "test2");
      });

      expect(mock).toHaveBeenCalledWith("test1", "test2");
      expect(result.current?.completed).toBe(true);
      expect(result.current?.result).toEqual("text");
  });
});

async function asyncAction(action: () => void) {
  // eslint-disable-next-line @typescript-eslint/require-await
  await act(async () => {
      action();
  });
}

function defer<T = any>() {
  let resolve: (value?: T | Promise<T>) => void;
  let reject: (reason?: any) => void;
  return {
      promise: new Promise<T>((resolveFn, rejectFn) => {
          resolve = resolveFn;
          reject = rejectFn;
      }),
      resolve,
      reject,
  };
}
