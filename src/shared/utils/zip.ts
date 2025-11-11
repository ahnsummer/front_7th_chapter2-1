export function zip<T, U>(arr1: T[], arr2: U[]): [T, U][] {
  return arr1.map((item, index) => [item, arr2[index]]);
}
