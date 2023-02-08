import invariant from "tiny-invariant";

const ReturnSymbol = Symbol("proxy return");
const ResolveSymbol = Symbol("proxy resolve");
const MockSymbol = Symbol("mock");
const DEFAULT_PROMISE_DEPTH = 20;

/**
 * Convenient mock object for testing.
 *
 * Similar to Python's `MagicMock`, `deepMock` has the following properties:
 * - Each child of `deepMock` is also a `deepMock`.
 * - Return value of a deeply mocked function is also a `deepMock`.
 * @param promiseDepth JS `await` recursively calls `then` method.
 * `promiseDepth` limits the number of consecutive `then` calls
 * so that `await` doesn't call `then` infinitely.
 */
export const deepMock = (promiseDepth: number = DEFAULT_PROMISE_DEPTH): any => {
  /**
   * Maps property key to the corresponding nested proxy.
   *
   * This ensures the getter always returns the same proxy given the same key.
   */
  const cache: Record<string | symbol, any> = {
    [MockSymbol]: jest.fn(() =>
      ReturnSymbol in cache
        ? cache[ReturnSymbol]
        : (cache[ReturnSymbol] = deepMock())
    ),
  };

  return new Proxy(class {}, {
    get: (target, prop, receiver) => {
      if (prop in cache) {
        return cache[prop];
      }
      if (prop === Symbol.toPrimitive || prop === "toString") {
        return () => "<mock>";
      }
      if (prop === "then" && promiseDepth === 0) {
        return undefined;
      }
      return (cache[prop] =
        prop === "then"
          ? (resolve: Function) =>
              resolve((cache[ResolveSymbol] ??= deepMock(promiseDepth - 1)))
          : deepMock());
    },
    apply: (target, thisArg, args) => cache[MockSymbol](...args),
    construct: () => deepMock(),
    has: (target, prop) => {
      if (prop === "then" && promiseDepth === 0) {
        return false;
      }
      return true;
    },
  });
};

/**
 * Access the Jest mock function that's wrapping the given deeply mocked function.
 * @param func the target function. It needs to be deeply mocked.
 */
export const mocked = <T extends (...args: any[]) => any>(
  func: T
): jest.Mock => {
  invariant(MockSymbol in func);
  const mock = func[MockSymbol];
  invariant(jest.isMockFunction(mock));
  return mock;
};

/**
 * Access the cached return value of the given deeply mocked function.
 * @param func the target function. It needs to be deeply mocked.
 */
export const returnValueOf = <T extends (...args: any[]) => any>(
  func: T
): any => {
  invariant(ReturnSymbol in func);
  return func[ReturnSymbol];
};
