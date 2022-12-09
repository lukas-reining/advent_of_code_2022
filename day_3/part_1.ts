import { readFileAsString, toLines } from "../helpers/parsing";
import { intersection } from "../helpers/set";
import { toSum } from "../helpers/math";

export type Compartment = [string[], string[]];

export function toCompartments(line: string): Compartment {
  const middle = line.length / 2;
  const part1 = line.substring(0, middle);
  const part2 = line.substring(middle, line.length);
  return [part1.split(""), part2.split("")];
}

export function toCommonType([compartment1, compartment2]: Compartment) {
  return intersection(compartment1, compartment2)[0];
}

export function toPriority(type: string) {
  const ascii = type.charCodeAt(0);
  const isUpper = ascii >= 65 && ascii <= 90;
  return isUpper ? ascii - 38 : ascii - 96;
}

export function solve() {
  const text = readFileAsString("./input.txt");
  return toLines(text)
    .map(toCompartments)
    .map(toCommonType)
    .map(toPriority)
    .reduce(toSum, 0);
}

console.log(solve());