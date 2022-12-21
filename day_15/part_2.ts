import {readFileAsString, toLines} from "../helpers/parsing";
import {
    calculateDistance,
    SensorBeaconPair,
    toSensorBeaconPair,
} from "./part_1";
import {numbersAscending} from "../helpers/sort";

export function toBeaconSpots(pairs: SensorBeaconPair[], y: number) {
    return pairs.reduce((rows, {sensor, beacon}) => {
        const distance = calculateDistance({sensor, beacon});
        let current = 0;

        for (
            let vertical = sensor.y - distance;
            vertical <= sensor.y + distance;
            vertical++
        ) {
            if (vertical >= 0 && vertical <= y) {
                const horizontalMin = sensor.x - current;
                const horizontalMax = sensor.x + current;

                rows[vertical] = rows[vertical] ?? [];
                rows[vertical].push({
                    min: horizontalMin,
                    max: horizontalMax,
                });
            }

            current = vertical < sensor.y ? current + 1 : current - 1;
        }

        return rows;
    }, new Array<{ min: number; max: number }[]>());
}

export function toMaximumBeaconSpots(pairs: SensorBeaconPair[], y: number) {
    const rows = toBeaconSpots(pairs, y)

    for (let i = 0; i < rows.length; i++) {
        let blocks = rows[i] ?? []

        for (let leapingIndex = 0; leapingIndex < y; leapingIndex++) {
            blocks = blocks.sort(({min: min1}, {min: min2}) => numbersAscending(min1, min2))

            for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
                let {min, max} = blocks[blockIndex]

                if (min <= leapingIndex && max >= leapingIndex) {
                    leapingIndex = Math.max(max, leapingIndex)
                } else if (min > leapingIndex) {
                    const [gapX, gapY] = [leapingIndex + 1, i]
                    return gapX * 4000000 + gapY
                }
            }
        }
    }
}

export function solve() {
    const text = readFileAsString("./input.txt");
    const pairs = toLines(text).map(toSensorBeaconPair);
    const result = toMaximumBeaconSpots(pairs, 4000000);
    return result;
}

console.log(solve());
