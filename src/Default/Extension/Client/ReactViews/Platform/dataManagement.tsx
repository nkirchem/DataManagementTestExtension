import * as React from "react";

/**
 * Helper that indirectly connects the data in a React Context to a component
 * that consumes the context by using a supplied selector function.
 *
 * @param context - Context to consume.
 * @returns Selector function that passes Context data to consuming component.
 */
export function createContextConnect<Context>(context: React.Context<Context>) {
  return function <Props, R = {}>(selector: (c: Context) => R) {
    const connectedComponent =
      (Comp: React.FunctionComponent<ReturnType<typeof selector> & Props>) =>
      (props: Props) => {
        const fullContext = React.useContext(context);
        const data = selector(fullContext);

        return <Comp {...data} {...props} />;
      };

    return connectedComponent;
  };
}

export function createComponentConnector<Context>(context: React.Context<Context>) {
    return function <TComponentProps, TPropertyKeys extends keyof Context>(properties: Array<TPropertyKeys>, Component: React.FunctionComponent<TComponentProps & Pick<Context, TPropertyKeys>>) {
        const MemoizedComponent = React.memo((combinedProps: TComponentProps & Pick<Context, TPropertyKeys>) => {
            return <Component {...combinedProps} />;
        });
        const connectorComponent: React.FunctionComponent<TComponentProps> = props => {
            const fullContext = React.useContext(context);
            const connectedData = properties.reduce((prev, current) => { prev[current] = fullContext[current]; return prev; }, {} as Pick<Context, TPropertyKeys>);
            const combinedProps = { ...connectedData, ...props } as JSX.IntrinsicAttributes & React.PropsWithRef<TComponentProps & Pick<Context, TPropertyKeys>>;
            return <MemoizedComponent {...combinedProps} />;
        };
        return connectorComponent;
    };
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
