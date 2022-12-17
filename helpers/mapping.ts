export function to<T, U extends keyof T>(property: U) {
  return (entity: T): T[U] => entity[property];
}

export function toIndexed<T> (value: T, index: number): [number, T] {
  return [index, value]
}