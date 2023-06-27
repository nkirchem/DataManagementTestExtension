import * as React from "react";

/**
 * Creates a connector function to hook up a component to one or more properties of a react context.
 *
 * The connector function will create a memoized component that will only re-render the supplied component when one of the
 * selected context properties OR any additional/explicit props supplied to the component changes.
 *
 * @param context The context to connect to
 * @returns Connector function that can be used to connect a component to the context
 */
export function createComponentConnector<Context>(context: React.Context<Context>) {
  return function <TComponentProps, TSelectedContext>(
    selector: (context: Context) => TSelectedContext,
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
 * Creates a context selector which picks the specified properties from the context.
 * 
 * @param propertyNames Names of the properties to select
 * @returns A function that can be passed to createComponentConnector's selector parameter to pick only the specified properties from the context.
 */
export function getContextSelector<TObject extends Object, TPropertyKeys extends keyof TObject>(propertyNames: Array<TPropertyKeys>) {
  return (context: TObject) => selectProps(context, propertyNames);
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
