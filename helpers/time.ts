export function measureTime<Result>(operation: () => Result) {
    const t0 = performance.now();
    const result = operation();
    const t1 = performance.now();
    console.log(`Operation took ${t1 - t0} milliseconds.`);
    return result
}