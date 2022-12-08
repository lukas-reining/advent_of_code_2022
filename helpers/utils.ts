export function tap<T>(func: (value: T) => void) {
    return (value: T) => {
        func(value);
        return value;
    };
}