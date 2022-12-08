export function numbersAscending(number1: number, number2: number) {
    return number1 - number2
}

export function numbersDescending(number1: number, number2: number) {
    return number2 - number1
}

export function toChunks<T>(inputArray: T[], chunks: number) {
    return inputArray.reduce((resultArray: T[][], item: T, index) => {
        const chunkIndex = Math.floor(index / chunks);

        if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
        }

        resultArray[chunkIndex].push(item);

        return resultArray;
    }, []);
}