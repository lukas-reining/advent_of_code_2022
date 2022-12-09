import { readFileAsString, toLines } from "../helpers/parsing";
import { toSum } from "../helpers/math";
import { toPriority } from "./part_1";
import { toChunks } from "../helpers/sort";
import { intersection } from "../helpers/set";

type ElveGroup = [string[], string[], string[]];

export function toElveGroups(rucksacks: string[]): ElveGroup[] {
  const elveRucksacks = toChunks(rucksacks, 3) as ElveGroup;
  return elveRucksacks.map(([elve1, elve2, elve3]) => [
    elve1.split(""),
    elve2.split(""),
    elve3.split(""),
  ]);
}

export function toCommonType([elve1, elve2, elve3]: ElveGroup) {
  const union1 = intersection(elve1, elve2);
  return intersection(union1, elve3)[0];
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const rucksacks = toLines(text);
  return toElveGroups(rucksacks)
    .map(toCommonType)
    .map(toPriority)
    .reduce(toSum, 0);
}

console.log(solve());