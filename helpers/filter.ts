export function whereEquals<T, Key extends keyof T>(prop: Key, value: T[Key]) {
    return (entity: T) => entity[prop] === value;
}

export function whereNotEquals<T, Key extends keyof T>(
    prop: Key,
    value: T[Key]
) {
    return (entity: T) => entity[prop] !== value;
}
