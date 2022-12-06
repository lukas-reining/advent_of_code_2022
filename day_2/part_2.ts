import { readFileAsString, toLines } from "../helpers/parsing";
import { toSum } from "../helpers/math";

const MoveCounterMoveMap: Record<string, string> = {
  AX: "AC", // Rock -> Loose = Scissors
  AY: "AA", // Rock -> Tie = Rock
  AZ: "AB", // Rock -> Win = Paper
  BX: "BA", // Paper -> Loose = Rock
  BY: "BB", // Paper -> Tie = Paper
  BZ: "BC", // Paper -> Win = Scissors
  CX: "CB", // Scissors -> Loose = Paper
  CY: "CC", // Scissors -> Tie = Scissors
  CZ: "CA", // Scissors -> Win = Rock
};

const ShapePointMap: Record<string, number> = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, //  Scissors
};

const MovePointMap: Record<string, number> = {
  AC: 0,
  AA: 3,
  AB: 6,
  BA: 0,
  BB: 3,
  BC: 6,
  CB: 0,
  CC: 3,
  CA: 6,
};

function toPoints(shape: string): number {
  const newShape = MoveCounterMoveMap[shape]
  return MovePointMap[newShape] + ShapePointMap[newShape[1]];
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
