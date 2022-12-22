import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";
import { createMatrix, Matrix } from "../helpers/matrix";
import { to } from "../helpers/mapping";
import { numbersDescending } from "../helpers/sort";
import {measureTime} from "../helpers/time";

export type PathPoint = { x: number; y: number };
export type Path = PathPoint[];
export type CaveField = "." | "#" | "o" | "+";
export type Cave = Matrix<CaveField>;

export function toPath(line: string): Path {
  const pointMatches = [...line.matchAll(/(\d+),(\d+)/gm)];
  return pointMatches.map(([_, x, y]) => ({
    x: toDecimalInt(x),
    y: toDecimalInt(y),
  }));
}

export function toCave(paths: Path[], withBottom = false) {
  const cave = createMatrix<CaveField>(".", 1000, 200);

  cave[0][500] = "+";

  if (withBottom) {
    const bottomY = paths.flat().map(to("y")).sort(numbersDescending)[0] + 2;
    cave[bottomY] = cave[bottomY].map(() => "#");
  }

  const applyPath = (cave: Cave, path: Path) => {
    let start = path[0];

    for (const point of path) {
      const xStart = Math.min(start.x, point.x);
      const xEnd = Math.max(start.x, point.x);
      const yStart = Math.min(start.y, point.y);
      const yEnd = Math.max(start.y, point.y);

      for (let x = xStart; x <= xEnd; x++) {
        for (let y = yStart; y <= yEnd; y++) {
          cave[y][x] = "#";
        }
      }
      start = point;
    }
    return cave;
  };

  return paths.reduce((currentCave, path) => {
    return applyPath(currentCave, path);
  }, cave);
}

export function dropSand(
  cave: Cave,
  xSand = 500,
  ySand = 0
): { finished: boolean; cave: Cave } {
  const newYSand = ySand + 1;

  const canMoveDown = cave[newYSand][xSand] === ".";
  const canMoveLeft = cave[newYSand][xSand - 1] === ".";
  const canMoveRight = cave[newYSand][xSand + 1] === ".";

  if (canMoveDown || canMoveLeft || canMoveRight) {
    cave[ySand][xSand] = ".";
  }

  if (newYSand + 1 >= cave.length) {
    cave[newYSand][xSand] = "o";
    return { finished: true, cave };
  }

  if (canMoveDown) {
    cave[newYSand][xSand] = "o";
    return dropSand(cave, xSand, newYSand);
  } else if (canMoveLeft) {
    cave[newYSand][xSand - 1] = "o";
    return dropSand(cave, xSand - 1, newYSand);
  } else if (canMoveRight) {
    cave[newYSand][xSand + 1] = "o";
    return dropSand(cave, xSand + 1, newYSand);
  } else if(newYSand === 1){
    return { finished: true, cave };
  }

  return { finished: false, cave };
}

export function printCave(cave: Cave) {
  console.log("Cave:");
  cave.forEach((row) => console.log(row.join("")));
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const paths = toLines(text).map(toPath);
  const cave = toCave(paths, false);

  let steps = 0;
  while (!dropSand(cave).finished) {
    steps++;
  }

  // printCave(cave);
  return steps;
}


const result = measureTime(() => solve());
console.log(result);
