import { readFileAsString, toLines } from "../helpers/parsing";
import { executeMove, getTopItems, newInputShip, toMove } from "./part_1";

export function solve() {
  const text = readFileAsString("./move_input.txt");
  const newShip = toLines(text)
    .map(toMove)
    .reduce(executeMove(true), newInputShip());
  return getTopItems(newShip);
}

console.log(solve());