import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";

export type Coordinate = {
  x: number;
  y: number;
};

export type SensorBeaconPair = {
  sensor: Coordinate;
  beacon: Coordinate;
};

export function toSensorBeaconPair(line: string): SensorBeaconPair {
  const matches = [
    ...line.matchAll(
      /^Sensor at x=(-?\d+), y=(-?\d+): closest beacon is at x=(-?\d+), y=(-?\d+)/gm
    ),
  ];
  return {
    sensor: { x: toDecimalInt(matches[0][1]), y: toDecimalInt(matches[0][2]) },
    beacon: { x: toDecimalInt(matches[0][3]), y: toDecimalInt(matches[0][4]) },
  };
}

export function calculateDistance({ sensor, beacon }: SensorBeaconPair) {
  return Math.abs(beacon.x - sensor.x) + Math.abs(beacon.y - sensor.y);
}

export function toBeaconSpots(pairs: SensorBeaconPair[], y: number) {
  return pairs.reduce((rows, { sensor, beacon }) => {
    const distance = calculateDistance({ sensor, beacon });

    const verticalMin = sensor.y - distance;
    const verticalMax = sensor.y + distance;

    let current = 0;
    if (verticalMin <= y && verticalMax >= y) {
      for (
        let vertical = sensor.y - distance;
        vertical <= sensor.y + distance;
        vertical++
      ) {
        if (vertical === y) {
          const [xMin, xMax] = [sensor.x - current, sensor.x + current];
          rows[vertical] = {
            min: Math.min(xMin, rows[vertical]?.min ?? 0),
            max: Math.max(xMax, rows[vertical]?.max ?? 0),
          };
        }
        current = vertical < sensor.y ? current + 1 : current - 1;
      }
    }

    return rows;
  }, new Array<{ min: number; max: number }>());
}

export function toMaximumBeaconSpots(pairs: SensorBeaconPair[], y: number) {
  const rows = toBeaconSpots(pairs, y)
  const min = rows[y].min;
  const max = rows[y].max;
  return Math.abs(max - min);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const pairs = toLines(text).map(toSensorBeaconPair);
  const result = toMaximumBeaconSpots(pairs, 2000000);
  return result;
}

console.log(solve());
