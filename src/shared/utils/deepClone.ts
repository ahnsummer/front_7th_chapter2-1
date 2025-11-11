export function deepClone<T>(value: T): T {
  if (typeof value === "object" && value != null) {
    if (Array.isArray(value)) {
      return cloneArray(value) as T;
    }

    return cloneObject(value);
  }

  return value;
}

function cloneObject<T>(value: T): T {
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).map(([key, value]) => [
      key,
      deepClone(value),
    ]),
  ) as T;
}

function cloneArray<T>(value: T[]): T[] {
  return value.map((item) => deepClone(item));
}
