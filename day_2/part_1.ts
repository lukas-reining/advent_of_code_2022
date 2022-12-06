import { readFileAsString, toLines } from "../helpers/parsing";
import { toSum } from "../helpers/math";

const MovePointMap: Record<string, number> = {
  AX: 3, // Rock -> Rock
  AY: 6, // Rock -> Paper
  AZ: 0, // Rock -> Scissors
  BX: 0, // Paper -> Rock
  BY: 3, // Paper -> Paper
  BZ: 6, // Paper -> Scissors
  CX: 6, // Scissors -> Rock
  CY: 0, // Scissors -> Paper
  CZ: 3, // Scissors -> Scissors
};

const ShapePointMap: Record<string, number> = {
  X: 1, // Rock
  Y: 2, // Paper
  Z: 3, //  Scissors
};

function toPoints(shape: string): number {
  return MovePointMap[shape] + ShapePointMap[shape[1]];
}

export function getPoints() {
  const text = readFileAsString("./input.txt");
  const lines = toLines(text);
  return lines.map((line) => line.replace(/\s/, "")).map(toPoints);
}

function solve() {
  const points = getPoints();
  return points.reduce(toSum);
}

console.log(solve());
