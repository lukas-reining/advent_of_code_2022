import { compare, Signal, Signals } from "./part_1";
import { toIndexed } from "../helpers/mapping";
import { toProduct } from "../helpers/math";

import input from "./input";
//import input from "./example_input";


const Divider_1: Signal = [[2]];
const Divider_2: Signal = [[6]];

export function toSignalOrder(left: Signal, right: Signal) {
  const sorted = compare([left, right]);

  if (sorted === null) {
    return 0;
  } else {
    return sorted ? -1 : 1;
  }
}

export function solve() {
  const pairs = input as Signals;

  return [...pairs, Divider_1, Divider_2]
    .sort(toSignalOrder)
    .map(toIndexed)
    .filter(([, signal]) => signal === Divider_1 || signal === Divider_2)
    .map(([index]) => index + 1)
    .reduce(toProduct, 1);
}

console.log(solve());