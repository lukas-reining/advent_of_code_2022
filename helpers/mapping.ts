export function to<T, U extends keyof T>(property: U) {
  return (entity: T): T[U] => entity[property];
}
