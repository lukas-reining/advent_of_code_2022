export function isDefined<T>(input?: T | null | undefined): input is T {
    return typeof input !== 'undefined' && input !== null;
}

export function whereEquals<T, Key extends keyof T>(prop: Key, value: T[Key]) {
    return (entity: T) => entity[prop] === value;
}

export function whereNotEquals<T, Key extends keyof T>(
    prop: Key,
    value: T[Key]
) {
    return (entity: T) => entity[prop] !== value;
}
