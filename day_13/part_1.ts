import { toChunks } from "../helpers/sort";
import { toIndexed } from "../helpers/mapping";
import { toSum } from "../helpers/math";

import input from "./input";
// import input from "./example_input";

export type Signal = [Signal] | number;
export type Signals = [Signal, Signal];

export function compare([left, right]: Signals): Boolean | null {
  if (typeof left === "number" && typeof right === "number") {
    return left === right ? null : left < right;
  } else if (typeof left === "number") {
    return compare([[left], right]);
  } else if (typeof right === "number") {
    return compare([left, [right]]);
  }

  for (let i = 0; i < Math.min(left.length, right.length); i++) {
    const res = compare([left[i], right[i]]);
    if (res !== null) return res;
  }

  return left.length === right.length ? null : left.length < right.length;
}

export function countRightOrderedPacket(pairs: Signals[]) {
  return pairs
    .map(compare)
    .map(toIndexed)
    .filter(([, value]) => value)
    .map(([index]) => index + 1)
    .reduce(toSum);
}

export function solve() {
  const pairs = toChunks(input, 2) as Signals[];
  return countRightOrderedPacket(pairs);
}

console.log(solve());