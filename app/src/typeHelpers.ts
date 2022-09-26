export function isDefined<T>(value: T): value is Exclude<T, null | undefined> {
  return value != null;
}

export function isNullish<T>(value: T): value is T & (null | undefined) {
  return value == null;
}
