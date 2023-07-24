# <span id="introduction">Introduction to useAsync</span>

`useAsync` is a custom React hook that aims to be an easy-to-use, out-of-the-box solution to some of the most common problems and complexities of writing async code in React. More specifically, it aims to help developers who need to:

* Run async operations, e.g. fetch data, in a component or custom hook.
* Prevent race conditions, stale state, and unnecessary re-rendering.
* Track the status of those operations, e.g. show a "loading"/"refreshing" message when a request is underway.
* Display an error message when the operation fails without needing to try/catch within the component.
* Re-run the operation conditionally when parameters change.
* Debounce network calls.

These are all common needs that, in React, require lots of boilerplate and are easy to get wrong. React's documentation even advises against writing your own ad-hoc data-fetching (i.e. async) logic in Effects:

> Writing data fetching directly in Effects gets repetitive and makes it difficult to add optimizations like caching and server rendering later. It’s easier to use a custom Hook—either your own or maintained by the community. (<https://react.dev/reference/react/useEffect#fetching-data-with-effects>)

## <span id="how-to-use">How to use `useAsync`</span>

Here's how you'd use it to fetch a string, display it in a component, and re-fetch when `props.subscriptionId` changes:

```TypeScript
const fetchData = (subscriptionId: string): Promise<string> => { /* etc */ };

const MyComponent = (props: { subscriptionId: string }) => {
    const { result } = useAsync(fetchData, [props.subscriptionId]);

    return <div>{result || "No result"}</div>;
};
```

Here's how you'd use it to debounce text-input validation.

```TypeScript

const validateInput = (text: string): Promise<string> => { /* etc */ };

const MyComponent = (props: { url: string }) => {
    const [input, setInput] = React.useState("");
    const { result: inputErrorMessage } = useAsync(validateInput, [input], { disabled: true, debounce: 200 });

    return <div>
        <TextField value={input} onChange={(_, newValue) => setInput(newValue)} />
        <div>{inputErrorMessage}</div>
    </div>;
};
```

[Here's how you'd use it to fetch data on click](#example7).

Arguments:

- The hook's first argument, `asyncOperation`, is a function that returns a JavaScript `Promise`. This is the async operation whose invocations you want to track/control.

- The next parameter, `deps` is the collection of dependencies that indicates whether the `asyncOperation` needs to be re-executed on re-render. Treat this as you would
any set of dependencies of a React useMemo, useEffect, or useCallback call. Dependencies are compared to previous values using strict equality (Object.is), so any complex
values should be memoized before being passed here. If any one of these `deps` are different from a previous render cycle, the async operation is re-executed.

  The `deps` array is also what is passed as arguments to the `asyncOperation`. If the list of arguments to `asyncOperation` should be different from `deps` - for example,
  if one of the arguments should not trigger a new operation if it changes, then you can wrap your asyncOperation within a new function/delegate which just passes along
  the desired arguments.

- The final argument, `options`, allows consumers to disable the hook or configure a debounce interval.

<div id="dependency-array-note" style="background-color:rgba(255, 229, 100, 0.3);color:black;padding:20px;border-radius:10px;margin:15px">
<div style="font-weight:700" id="dependency-array-note">Note:</div>
<br/>
The <code>deps</code> parameter serves a function similar to that of <code>useMemo</code> or <code>useEffect</code>'s dependency array, in that <code>useAsync</code> watches it for changes and fires <code>asyncOperation</code> only when at least one of its elements has changed. Dependencies are compared to previous values using strict equality (Object.is), so any complex
values should be memoized before being passed here. However, unlike the <code>useEffect</code> dependancy array, <code>args</code> is strongly typed. <code>typeof args</code> must match <code>Parameters&lt;typeof asyncOperation&gt;</code>. If it doesn't, TypeScript compilation will fail.
</div>

When any of its arguments change, `useAsync` runs the logic that decides whether `asyncOperation` should fire -- or re-fire:

* If `options.disabled` is `true` or all values passed to `deps` are the same (instance-level) as the last render pass, `asyncOperation` won't fire.
* If `options.disabled` is not `true` and any value in `deps` has changed since its last invocation, `asyncOperation` will fire.

The hook thereby ensures that `asyncOperation` is called (conditionally) only once for a given set of parameters, until parameters change.

The hook also detects overlapping `asyncOperation` calls and allows only the most recent one to update state, regardless of the order in which they resolve. This reduces needless re-rendering and prevents race conditions and stale state.

## <span id="examples">Here are a few more examples of ways the hook can be used:</span>

### <span id="example1">Example 1 - Re-run the operation automatically whenever props change:</span>

```TypeScript
const MyComponent = (props: {
    arg1: string;
    arg2: number;
    asyncOperation: (arg1: string, arg2: number) => Promise<string>;
}) => {
    const { arg1, arg2, asyncOperation } = props
    const { result } = useAsync(asyncOperation, [arg1, arg2]);

    return <div>{result}</div>;
};
```

### <span id="example2">Example 2 - Only run the hook if an optional argument is supplied:</span>

```TypeScript
const MyComponent = (props: {
    asyncOperation: (subscriptionId: string) => Promise<string>,
    subscriptionId?: string;
}) => {
    const { asyncOperation, subscriptionId } = props
    const { result } = useAsync(asyncOperation, [subscriptionId], { disabled: !subscriptionId });

    return <div>{result}</div>;
};
```

### <span id="example3">Example 3 - Show simple 'loading' status message:</span>

```TypeScript
const MyComponent = (props: {
    arg1: string;
    arg2: number;
    asyncOperation: (arg1: string, arg2: number) => Promise<string>;
}) => {
    const { arg1, arg2, asyncOperation } = props
    const { loading, result } = useAsync(asyncOperation, [arg1, arg2]);

    return <div>{loading ? "Loading..." : result}</div>;
};
```

### <span id="example4">Example 4 - Show operation status at a more granular level:</span>

```TypeScript
const MyComponent = (props: {
    arg1: string;
    arg2: number;
    asyncOperation: (arg1: string, arg2: number) => Promise<string>;
}) => {
    const { arg1, arg2, asyncOperation } = props
    const { error, inProgress, loading, result } = useAsync(asyncOperation, [arg1, arg2]);

    return <div>
        {
            loading ? (
                <div>Initial load of the data...</div>
            ) : (
                <div>
                    {inProgress && <div>Operation is in progress (via update call)</div>}
                    {
                        error ? (
                            <div>Error: ${error.message}</div>
                        ) : (
                            <div>Result: ${result}</div>
                        )
                    }
                </div>
            )
        }
    </div>;
};
```

### <span id="example5">Example 5 - Run async operation automatically and manually:</span>

```TypeScript
const MyComponent = (props: {
    arg1: string;
    arg2: number;
    asyncOperation: (arg1: string, arg2: number) => Promise<string>;
}) => {
    const { arg1, arg2, asyncOperation } = props
    const { inProgress, result, update } = useAsync(asyncOperation, [arg1, arg2]);

    return <div>
        <button onClick={update}>Refresh result</button>
        {inProgress && <div>Fetching...</div>}
        <div>{result}</div>
    </div>;
};
```

### <span id="example6">Example 6 - Run your async operation manually:</span>

```TypeScript
const MyComponent = (props: {
    arg1: string;
    arg2: number;
    asyncOperation: (arg1: string, arg2: number) => Promise<string>;
}) => {
    const { arg1, arg2, asyncOperation } = props
    const { result, update } = useAsync(asyncOperation, [arg1, arg2], { disabled: true });

return <div>
        <button onClick={update}>Run async operation</button>
        {inProgress && <div>Fetching...</div>}
        <div>{result}</div>
    </div>;
};
```

### <span id="example7">Example 7 - Debounce validation of text input:</span>

```TypeScript
const MyComponent = (props: {
    validateInput: (arg1: string) => Promise<boolean>;
}) => {
    const { validateInpt } = props;
    const [input, setInput] = React.useState("");
    const {
        result: isValid,
        inProgress: validating,
        error: validationerror
    } = useAsync(validateInput, [input], { disabled: true, debounce: 200 });
    
    let validationMessage = React.useMemo(
        () => {
            if (validationerror) {
                return validationerror.message;
            } else if (result !== undefined) {
                return result ? "Input is valid" : "Input is invalid";
            } else if (inProgress) {
                return "Validating...";
            } else {
                return "No validation yet";
            }
        },
        [loadingFirstValidationResult, validating, isValid, asyncError]
    );

    return <div>
        <TextField value={input} onChange={(_, newValue) => setInput(newValue)}>
        <div>{validationMessage}</div>
    </div>;
};
```

## How NOT to use `useAsync`

There are two simple rules of thumb:

1. Do not declare and manually update state variables so as to store and accesss the data returned by the hook. Let the hook do this for you.
1. [Unless you need to chain async operations](#chaining-calls), it should almost never be necessary to write async code when you use the hook. Let the hook handle `then`, `catch`, and `finally`.

The following should therefore be considered an incorrect use of the hook:
```TypeScript
const { update } = useAsync(fetch, [url], { disabled: true });
const [fetchedData, setFetchedData] = React.useState<string>(""); // unnecessary state variable
const callback = React.useCallback(() => update().then(r => setFetchedData(r.result)),[update]); // unnecessary async code

return <div>
    <button onClick={callback}>Click me</button>
    <div>{fetchedData}</div>
</div>;
```
The caller in the example above 

* Manually declares the state variable `fetchedData`.
* Manually calls `then` in order to access the promise's resolved value
* Manually updates the state variable with the resolved value.

All of this is extraneous. The caller should simply access `result`, which always contains the most recent resolved value of `asyncOperation(...deps)`:
```TypeScript
const { result, update } = useAsync(fetch, url, { disabled: true });

return <div>
    <button onClick={update}>Click me</button>
    <div>{result}</div>
</div>;
```
The result: cleaner, more compact, and more efficient code -- and almost certainly a component/hook that renders fewer times.


## Questions

### What if my async function takes no arguments?

When `deps` is empty, the hook behaves as `useEffect` does when its dependency array is empty: because there are no dependencies, there also are no dependency changes between renders, and so the callback fires only once during the first render pass, or again if `update` is explicitly called.

### The hook is looping infinitely in my code. What's going on?

If it's looping infinitely, it's doing so for the same reason any hook/component would: the hook is stuck in a loop that changes one of its props. The same debugging techniques that you'd use in React should still be useful. `console.log` the props and figure out which change:

```TypeScript
const MyComponent = (props: { fetch, arg1, arg2, arg3, arg4 }) => {
    const { fetch, arg1, arg2, arg3, arg4 } = props;
    const { result } = useAsync(fetch, [arg1, arg2, arg3, arg4]);

    React.useEffect(() => console.log('fetch', fetch), [fetch]);
    React.useEffect(() => console.log('arg1', arg1), [arg1]);
    React.useEffect(() => console.log('arg2', arg2), [arg2]);
    React.useEffect(() => console.log('arg3', arg3), [arg3]);
    React.useEffect(() => console.log('arg4', arg4), [arg4]);

    return <div>{result}</div>;
};
```

### <span id="chaining-calls">What if I need to chain async operations? And what if I need to save the result of each one?</span>

Don't chain instances of the hook this way:

```TypeScript
const MyComponent = (props) => {
    const { result } = useAsync(fetch, [props.url]);
    const { result: result2} = useAsync(fetch, [props.url, result]);
    const { result: result3} = useAsync(fetch, [props.url, result2]);
    // etc.
}
```

Unless your hook/component should update after each operation finishes, asynchronous code that chains your operations without state updates will be more efficient:

```TypeScript
const MyComponent = (props) => {
    const fetchAll = React.useCallback(() =>
        fetch(props.url)
            .then(result => fetch(props.url, result)])
            .then(result2 => fetch(props.url, result2))
            .then(result3 => [result, result2, result3]),
        [props.url]
    );
    const [result, result2, result3] = useAsync(fetchAll, [props.url]).result || [];
    // etc.
}
```
