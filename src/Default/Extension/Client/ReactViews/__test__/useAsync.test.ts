import { act, renderHook } from "@testing-library/react-hooks";
import { UseAsyncOperationContext, useAsync, useAsyncWithContext } from "../Platform/useAsync";

describe("useAsync", () => {
  test("deps are passed in through args", async () => {
    let args: any[] = [];
    renderHook(() => useAsync((a1, a2, a3) => {
      args = [a1, a2, a3];
      return new Promise(() => {});
    }, ["arg1", false, 123]));
    expect(args).toEqual(["arg1", false, 123]);
  });

  test("returns successful async result", async () => {
    const { result, rerender } = renderHook(() => useAsync(() => Promise.resolve("text"), []));
    expect(result.current?.result).toBeUndefined();
    expect(result.current?.error).toBeUndefined();
    expect(result.current?.loading).toBe(true);
    expect(result.current?.inProgress).toBe(true);

    await act(async () => { rerender() });

    expect(result.current?.result).toEqual("text");
    expect(result.current?.error).toBeUndefined();
    expect(result.current?.loading).toBe(false);
    expect(result.current?.inProgress).toBe(false);
  });

  test("returns rejected async result", async () => {
    const { result, rerender } = renderHook(() => useAsync(() => Promise.reject("text"), []));
    expect(result.current?.result).toBeUndefined();
    expect(result.current?.error).toBeUndefined();
    expect(result.current?.loading).toBe(true);
    expect(result.current?.inProgress).toBe(true);

    await act(async () => { rerender() });

    expect(result.current?.result).toBeUndefined();
    expect(result.current?.error).toEqual("text");
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
    await act(async () => { rerender() });

    await act(async () => {
      deferred1.resolve("text1");
    });

    expect(result.current?.result).toBeUndefined();
    expect(result.current?.inProgress).toBe(true);

    await act(async () => {
      deferred2.resolve("text2");
    });

    expect(result.current?.result).toEqual("text2");
    expect(result.current?.inProgress).toBe(false);
  });

  test("hook does not run while disabled", async() => {
    const { result, rerender } = renderHook(() => useAsync(() => Promise.resolve("text"), [], { disabled: true }));
    expect(result.current?.result).toBeUndefined();
    expect(result.current?.error).toBeUndefined();
    expect(result.current?.loading).toBe(false);
    expect(result.current?.inProgress).toBe(false);

    await act(async () => { rerender() });

    expect(result.current?.result).toBeUndefined();
    expect(result.current?.error).toBeUndefined();
    expect(result.current?.loading).toBe(false);
    expect(result.current?.inProgress).toBe(false);
  });

  test("async operation is not invoked again unless deps change", async() => {
    const mock = jest.fn().mockResolvedValue("text");
    let prop1 = "value1";
    let lastArgument = "";

    const { result, rerender } = renderHook(() => useAsync((arg1) => {
      lastArgument = arg1;
      return mock();
    }, [prop1]));

    expect(lastArgument).toEqual("value1");
    expect(mock).toHaveBeenCalledTimes(1);

    await act(async () => { rerender() });
    await act(async () => { rerender() });

    expect(lastArgument).toEqual("value1");
    expect(mock).toHaveBeenCalledTimes(1);
    expect(result.current?.result).toEqual("text");

    prop1 = "value2";
    await act(async () => { rerender() });
    expect(lastArgument).toEqual("value2");
    expect(mock).toHaveBeenCalledTimes(2);
  });

  test("invoking update re-runs a completed result", async() => {
    const mock = jest.fn().mockResolvedValue("text");
    let context: UseAsyncOperationContext;
    const { result, rerender } = renderHook(() => useAsyncWithContext(ctx => {
      context = ctx;
      return mock();
    }, []));
    await act(async () => { rerender() });
    expect(result.current?.result).toEqual("text");
    expect(context.updating).toBe(false);
    expect(mock).toHaveBeenCalledTimes(1);

    // Update without clearing previous result
    mock.mockResolvedValue("text2");
    act(() => {
      result.current?.update();
    });
    expect(result.current?.result).toEqual("text");
    expect(result.current?.loading).toEqual(false);
    expect(result.current?.inProgress).toEqual(true);
    expect(context.updating).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);

    await act(async () => { rerender() });
    expect(result.current?.result).toEqual("text2");
    expect(result.current?.loading).toEqual(false);
    expect(result.current?.inProgress).toEqual(false);
  });

  test("invoking update with clearPreviousData removes a prior result", async() => {
    const mock = jest.fn().mockResolvedValue("text");
    let context: UseAsyncOperationContext;
    const { result, rerender } = renderHook(() => useAsyncWithContext(ctx => {
      context = ctx;
      return mock();
    }, []));
    await act(async () => { rerender() });
    expect(result.current?.result).toEqual("text");
    expect(context.updating).toBe(false);
    expect(mock).toHaveBeenCalledTimes(1);

    // Update without clearing previous result
    mock.mockResolvedValue("text2");
    act(() => {
      result.current?.update({ clearPreviousData: true });
    });
    expect(result.current?.result).toBeUndefined();
    expect(result.current?.loading).toEqual(true);
    expect(result.current?.inProgress).toEqual(true);
    expect(context.updating).toBe(true);
    expect(mock).toHaveBeenCalledTimes(2);

    await act(async () => { rerender() });
    expect(result.current?.result).toEqual("text2");
    expect(result.current?.loading).toEqual(false);
    expect(result.current?.inProgress).toEqual(false);
  });

  test("update can run a disabled operation when ignoreDisabled is true", async() => {
    const mock = jest.fn().mockResolvedValue("text");
    const { result, rerender } = renderHook(() => useAsync(mock, [], { disabled: true }));
    await act(async () => { rerender() });
    expect(mock).toHaveBeenCalledTimes(0);

    // Update without ignoreDisabled should no-op
    act(() => {
      result.current?.update({ ignoreDisabled: false });
    });
    await act(async () => { rerender() });
    expect(mock).toHaveBeenCalledTimes(0);

    // Update with ignoreDisabled should run the operation
    act(() => {
      result.current?.update({ ignoreDisabled: true });
    });
    await act(async () => { rerender() });
    expect(mock).toHaveBeenCalledTimes(1);
    expect(result.current?.result).toEqual("text");
  });

  test("debounce only runs the operation after the interval", async() => {
    jest.useFakeTimers();

    const mock = jest.fn().mockResolvedValue("text");
    let depValue = 1;
    const { result, rerender } = renderHook(() => useAsync(mock, [depValue], { debounce: 100 }));
    await act(async () => { rerender() });

    depValue = 2;
    await act(async () => { rerender() });
    
    depValue = 3;
    await act(async () => { rerender() });

    expect(mock).toHaveBeenCalledTimes(0);
    expect(result.current?.result).toBeUndefined();

    await act(async () => {
      jest.advanceTimersByTime(101);
    });

    expect(mock).toHaveBeenCalledTimes(1);
    await act(async () => { rerender() });
    expect(mock).toHaveBeenCalledTimes(1);
    expect(result.current?.result).toEqual("text");
  });

  test("unmount with an incomplete operation", async() => {
    const deferred = defer();
    let context: UseAsyncOperationContext;
    const { result, rerender, unmount } = renderHook(() => useAsyncWithContext((ctx) => {
      context = ctx;
      return deferred.promise;
    }, []));
    await act(async () => { rerender() });

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
