import * as React from "react";
import { render } from "@testing-library/react";
import { act, renderHook } from "@testing-library/react-hooks";
import { createComponentConnector, selectProps, usePropertyBag } from "../Platform/dataManagement";

describe("createComponentConnector", () => {
  const TestContext = React.createContext({ key1: "value1", key2: "value2" });
  test("withComponentProps returns the connector", () => {
      const connector = createComponentConnector(TestContext);
      expect(connector.withComponentProps<{ key3: string }>()).toBe(connector);
  });
  test("connect returns a memoized component", () => {
      const connector = createComponentConnector(TestContext);
      const Component = connector.connect(
          (ctx) => ({ connectedKey1: ctx.key1 }),
          ({ connectedKey1 }) => <div data-testid="test1">{connectedKey1}</div>
      );
      const result = render(<Component />);
      expect(result.getByTestId("test1").textContent).toBe("value1");
  });
  test("connectContextProps returns a memoized component", () => {
      const connector = createComponentConnector(TestContext);
      const Component = connector.connectContextProps(["key1"], ({ key1 }) => <div data-testid="test1">{key1}</div>);
      const result = render(<Component />);
      expect(result.getByTestId("test1").textContent).toBe("value1");
  });
});

describe("selectProps", () => {
  test("returns an object with the selected props", () => {
      expect(selectProps({ key1: "value1", key2: "value2", key3: "value3" }, ["key1", "key2"])).toEqual({
          key1: "value1",
          key2: "value2",
      });
  });
});

describe("usePropertyBag", () => {
  test("merges with previous state on updates", () => {
      const { result } = renderHook(() => usePropertyBag<{ key1: string; key2?: string }>({ key1: "value1" }));
      expect(result.current[0]).toEqual({ key1: "value1" });

      act(() => {
          result.current[1]({ key2: "value2" });
      });
      expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });
  });
  test("merges with previous state on updates using update selector", () => {
      const { result } = renderHook(() => usePropertyBag<{ key1: string; key2?: string }>({ key1: "value1" }));
      expect(result.current[0]).toEqual({ key1: "value1" });

      act(() => {
          result.current[1](() => ({ key2: "value2" }));
      });
      expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });
  });
  test("correctly uses an initializer function", () => {
      const initializerMock = jest.fn().mockReturnValue({ key1: "value1" });
      const { result, rerender } = renderHook(() => usePropertyBag<{ key1: string; key2?: string }>(initializerMock));
      expect(result.current[0]).toEqual({ key1: "value1" });

      act(() => {
          result.current[1]({ key2: "value2" });
      });
      expect(result.current[0]).toEqual({ key1: "value1", key2: "value2" });

      // Initializer mock should only be called once, even after re-render
      act(rerender);
      expect(initializerMock).toHaveBeenCalledTimes(1);
  });
});
