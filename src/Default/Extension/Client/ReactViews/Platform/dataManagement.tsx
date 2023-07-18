import * as React from "react";

/**
 * Result of the call to createComponentConnector for a given context. Provides methods for connecting the context to a component.
 */
export interface IComponentConnector<TContext, TComponentProps> {
  /**
   * Connect the given context to a component, given a selector function that uses the context to generate context-based-props for the component to use.
   *
   * @param selector Generate context-based props for the component to use
   * @param Component The React component to connect to the context
   * @returns Component which internally picks up context-based props and updates only when they (or any component-specific props) change
   */
  connect: <TSelectedContext>(
    selector: (context: TContext) => TSelectedContext,
    Component: React.FunctionComponent<TComponentProps & TSelectedContext>
  ) => React.FunctionComponent<TComponentProps>;
  
  /**
   * Connect the given context to a component, given the names of properties in the context that the component needs to consume.
   *
   * @param contextPropertyNames Names of properties in the context for the component to use
   * @param Component The React component to connect to the context
   * @returns Component which internally picks up context-based props and updates only when they (or any component-specific props) change
   */
  connectContextProps: <TPropertyKeys extends keyof TContext>(
    contextPropertyNames: TPropertyKeys[],
    Component: React.FunctionComponent<TComponentProps & Pick<TContext, TPropertyKeys>>
  ) => React.FunctionComponent<TComponentProps>;

  /**
   * Creates a new connector that can be used to connect a component to the context, but with additional props that are not part of the context.
   *
   * @returns New connector with the given additional component-specific props
   */
  withComponentProps: <TAdditionalComponentProps>() => IComponentConnector<TContext, TAdditionalComponentProps>;
}

/**
 * Creates a connector function to hook up a component to one or more properties of a react context.
 *
 * The connector function will create a memoized component that will only re-render the supplied component when one of the
 * selected context properties OR any additional/explicit props supplied to the component changes.
 *
 * @param context The context to connect to
 * @returns Connector function that can be used to connect a component to the context
 */
export function createComponentConnector<TContext>(context: React.Context<TContext>): IComponentConnector<TContext, {}> {
  function connect<TComponentProps, TSelectedContext>(
    selector: (context: TContext) => TSelectedContext,
    Component: React.FunctionComponent<TComponentProps & TSelectedContext>
  ) {
    const MemoizedComponent = React.memo((combinedProps: TComponentProps & TSelectedContext) => {
      return <Component {...combinedProps} />;
    });
    const connectorComponent: React.FunctionComponent<TComponentProps> = (props) => {
      const fullContext = React.useContext(context);
      const connectedData = selector(fullContext);
      const combinedProps = { ...connectedData, ...props } as JSX.IntrinsicAttributes &
        React.PropsWithRef<TComponentProps & TSelectedContext>;
      return <MemoizedComponent {...combinedProps} />;
    };
    return connectorComponent;
  };

  const connector = {
    connect: function<TSelectedContext>(selector: (context: TContext) => TSelectedContext, Component: React.FunctionComponent<TSelectedContext>) {
      return connect(selector, Component);
    },
    connectContextProps: function<TPropertyKeys extends keyof TContext>(contextPropertyNames: TPropertyKeys[], Component: React.FunctionComponent<Pick<TContext, TPropertyKeys>>) {
      return connect(ctx => selectProps(ctx, contextPropertyNames), Component);
    },
    withComponentProps: function() {
      return connector;
    }
  };

  return connector;
}

/**
 * Selects the specified properties from the given object and returns them as a new object.
 *
 * @param object Object whose properties to selectively pick
 * @param propertyNames Names of the properties to pick
 * @returns New object with only the selected properties
 */
export function selectProps<TObject extends Object, TPropertyKeys extends keyof TObject>(object: TObject, propertyNames: Array<TPropertyKeys>): Pick<TObject, TPropertyKeys> {
  const selectedData = propertyNames.reduce((prev, current) => {
    prev[current] = object[current];
    return prev;
  }, {} as Pick<TObject, TPropertyKeys>);
  return selectedData;
}

/**
 * Memoizes an object using React.useMemo and uses the keys of the object's properties'
 * identities as the memo dependency.
 *
 * @param context - Object to memoize.
 * @returns Memoized object.
 */
export function useMemoizeObject<T extends Object>(context: T) {
  const contextHash = Object.keys(context).map((key) => (context as any)[key]);
  return React.useMemo(() => context, contextHash);
}

/**
 * Use a property bag as state, allowing partial state updates through the returned dispatcher
 *
 * @param initialState Initial state of the property bag.
 * @returns [The current property bag state, dispatcher to update parts of the property bag]
 */
export function usePropertyBag<T>(initialState: T) {
  const reducer = (state: T, action: Partial<T> | ((state: T) => Partial<T>)) => {
    const newState = typeof action === "function" ? action(state) : action;
    return { ...state, ...newState };
  };
  return React.useReducer<React.Reducer<T, Partial<T> | ((state: T) => Partial<T>)>>(reducer, initialState);
}
