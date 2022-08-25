/**
 * Convert an array to an object using a property as a key.
 * @returns A new object mapping keys to objects
 * @example
 * const array = [{name: "John", state: "TX"}, {name: "Jane", state: "CA"}]
 * const mapped = mapObjects(array, "name")
 * mapped === {
 *   John: {name: "John", state: "TX"},
 *   Jane: {name: "Jane", state: "CA"},
 * }
 */
export function mapObjects<
  KeyName extends string | number | symbol,
  KeyType extends string | number | symbol,
  Element extends {
    [K in KeyName]: KeyType;
  }
>(
  array: Element[],
  keyName: KeyName
): {
  [K in KeyType]?: Element;
} {
  const indexed: {
    [K in KeyType]?: Element;
  } = {};
  for (const element of array) {
    indexed[element[keyName]] = element;
  }
  return indexed;
}

/**
 * Merge objects from two arrays
 * @returns A new array with merged objects.
 * @example
 * const first = [{id: 1, name: "John"}, {id: 2, name: "Jane"}]
 * const second = [{id: 2, state: "CA"}, {id: 1, state: "TX"}]
 * const merged = zipObjectArray(first, second, "id")
 * merged === [
 *   {id: 1, name: "John", state: "TX"},
 *   {id: 2, name: "Jane", state: "CA"},
 * ]
 */
export function zipObjectArray<
  KeyName extends string | number | symbol,
  KeyType extends string | number | symbol,
  FirstArrayElement extends {
    [K in KeyName]: KeyType;
  },
  SecondArrayElement extends {
    [K in KeyName]: KeyType;
  }
>(
  firstArray: FirstArrayElement[],
  secondArray: SecondArrayElement[],
  keyName: KeyName
): (FirstArrayElement & SecondArrayElement)[] {
  const indexedSecondArray = mapObjects(secondArray, keyName);
  const ret = firstArray.map((firstElement) => {
    const key: string | number | symbol = firstElement[keyName];
    const secondElement = indexedSecondArray[key];
    if (secondElement === undefined) {
      throw new Error(`secondArray does not have ${String(key)}`);
    }
    return {
      ...firstElement,
      ...secondElement,
    };
  });
  return ret;
}
