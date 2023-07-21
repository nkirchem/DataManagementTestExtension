import * as React from "react";
import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createComponentConnector, selectProps, useMemoizeObject, usePropertyBag } from "../Platform/dataManagement";

describe("createComponentConnector", () => {
  const TestContext = React.createContext({ key1: "value1", key2: "value2" });
  test("withComponentProps returns the connector", () => {
    const connector = createComponentConnector(TestContext);
    expect(connector.withComponentProps<{ key3: string }>()).toBe(connector);
  });
  test("connect returns a memoized component", async () => {
    const connector = createComponentConnector(TestContext);
    const Component = connector.connect(ctx => ({ connectedKey1: ctx.key1 }), ({ connectedKey1 }) => <div data-testid="test1">{connectedKey1}</div>);
    const result = render(<Component />);
    expect(result.getByTestId("test1").textContent).toBe("value1");
  });
  test("connectContextProps returns a memoized component", async () => {
    const connector = createComponentConnector(TestContext);
    const Component = connector.connectContextProps(["key1"], ({ key1 }) => <div data-testid="test1">{key1}</div>);
    const result = render(<Component />);
    expect(result.getByTestId("test1").textContent).toBe("value1");
  });
});

describe("selectProps", () => {
  test("returns an object with the selected props", async () => {
    expect(selectProps({ key1: "value1", key2: "value2", key3: "value3" }, ["key1", "key2"])).toEqual({ key1: "value1", key2: "value2" });
  });
});

describe("useMemoizedObject", () => {
  test("returns the same object unless property values have changed", async () => {
    let objectToMemoize = { key1: "value1" };

    const { result, rerender } = renderHook(() => useMemoizeObject(objectToMemoize));
    expect(result.current).toEqual({ key1: "value1" });
    let prevResult = result.current;

    // Rerender with different object but identical properties. Should return previous object
    objectToMemoize = { key1: "value1" };
    await act(async () => { rerender(); });
    expect(prevResult).toBe(result.current);
    expect(result.current).toEqual({ key1: "value1" });
    expect(result.current).not.toBe(objectToMemoize);

    // Rerender with a different property value
    objectToMemoize = { key1: "value2" };
    await act(async () => { rerender(); });
    expect(result.current).not.toBe(prevResult);
    expect(result.current).toBe(objectToMemoize);
  });
});

describe("usePropertyBag", () => {
  test("merges with previous state on updates", async () => {
    const { result } = renderHook(() => usePropertyBag<{ key1: string; key2?: string; }>({ key1: "value1" }));
    expect(result.current[0]).toEqual({ key1: "value1" });

    await act(async () => {
      result.current[1]({ key2: "value2" });
    });
    expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });
  });
  test("merges with previous state on updates using update selector", async () => {
    const { result } = renderHook(() => usePropertyBag<{ key1: string; key2?: string; }>({ key1: "value1" }));
    expect(result.current[0]).toEqual({ key1: "value1" });

    await act(async () => {
      result.current[1](() => ({ key2: "value2" }));
    });
    expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });
  });
});
