import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";
import { toSum } from "../helpers/math";
import { numbersDescending } from "../helpers/sort";

function toElves(elves: string[][], item: string): string[][] {
  if (!item.length) {
    return [...elves, []];
  }

  elves[elves.length - 1].push(item);
  return elves;
}

function toCalories(elve: string[]) {
  return elve.map(toDecimalInt).reduce(toSum, 0);
}

export function getCalories() {
  const text = readFileAsString("./input.txt");
  const lines = toLines(text);
  return lines.reduce(toElves, [[]]).map(toCalories).sort(numbersDescending);
}

function solve() {
  const calories = getCalories();
  return calories[0];
}

console.log(solve());
