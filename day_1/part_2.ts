import { getCalories } from "./part_1";
import { toSum } from "../helpers/math";

function solve() {
  const calories = getCalories();
  return calories.slice(0, 3).reduce(toSum, 0);
}

console.log(solve());
