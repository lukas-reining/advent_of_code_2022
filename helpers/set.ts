export function intersection<T>(array1: T[], array2: T[]) {
  return array1.filter((item) => array2.includes(item));
}
