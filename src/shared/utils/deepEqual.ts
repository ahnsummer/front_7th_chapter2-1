export function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;
  if (typeof a !== "object") return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((value, index) => deepEqual(value, b[index]))
    );
  }
  if (
    typeof a === "object" &&
    a != null &&
    typeof b === "object" &&
    b != null
  ) {
    return (
      Object.keys(a).length === Object.keys(b).length &&
      Object.keys(a).every((key) =>
        deepEqual(a[key as keyof typeof a], b[key as keyof typeof b]),
      )
    );
  }
  return false;
}
