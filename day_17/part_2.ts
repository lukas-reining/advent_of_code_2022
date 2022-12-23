import { shapes } from "./shapes";
import { readFileAsString } from "../helpers/parsing";
import { measureTime } from "../helpers/time";

export type ChamberField = "." | "#";
export type Chamber = ChamberField[][];
export type Shape = [number, number][];

const chamberWidth = 7;

function* jets(
  jetInput: string
): Generator<{ index: number; jet: string }, { index: number; jet: string }> {
  let index = 0;

  while (true) {
    const nextValue = index % jetInput.length;
    index += 1;
    yield { index: nextValue, jet: jetInput[nextValue] };
  }
}

function addRows(rows: number, chamber: Chamber) {
  return Array.from(Array(rows)).reduce((newChamber) => {
    const newRows = new Array<ChamberField>(chamberWidth).fill(".");
    newChamber.unshift(newRows);
    return newChamber;
  }, chamber);
}

function shapeHeight(shape: Shape): number {
  return Math.max(...shape.map(([_, y]) => y)) + 1;
}

function move(shape: Shape, xOff: number, yOff: number): Shape {
  return shape.map(([x, y]) => [x + xOff, y + yOff]);
}

function collides(shape: Shape, chamber: Chamber) {
  return shape.reduce((acc, [x, y]) => {
    return (
      acc ||
      x < 0 ||
      x > chamberWidth - 1 ||
      y >= chamber.length ||
      chamber[y][x] !== "."
    );
  }, false);
}

function addRocks(chamber: Chamber, shape: Shape) {
  shape.forEach(([x, y]) => {
    chamber[y][x] = "#";
  });

  return chamber;
}

function printChamber(chamber: Chamber) {
  console.log(chamber.map((row) => row.join("")).join("\n"));
}

function simulate(input: string) {
  const shape = shapes();
  const jet = jets(input);

  let chamber = addRows(10, []);
  let rockHeight = 0n;
  let fallenRocks = 0n;

  const cache: Record<string, [bigint, bigint]> = {};
  const cacheSize = 30;
  let repeatingHeight = 0n;

  const target = 1000000000000n;

  while (fallenRocks < target) {
    console.log(fallenRocks);

    let { shape: currentShape, index: shapeIndex } = shape.next().value;

    const shapeHeight1 = shapeHeight(currentShape);
    chamber = addRows(shapeHeight1, chamber);

    const yOffset = BigInt(chamber.length) - rockHeight - 3n;
    currentShape = move(currentShape, 2, Number(yOffset) - shapeHeight1);

    let groundCollision = false;
    while (!groundCollision) {
      const { index: jetIndex, jet: currentJet } = jet.next().value;

      let movedShape;
      if (currentJet === "<") {
        movedShape = move(currentShape, -1, 0);
      } else {
        movedShape = move(currentShape, 1, 0);
      }

      if (!collides(movedShape, chamber)) {
        currentShape = movedShape;
      }

      movedShape = move(currentShape, 0, 1);

      if (collides(movedShape, chamber)) {
        chamber = addRocks(chamber, currentShape);
        fallenRocks += 1n;
        const upperY = Math.min(...currentShape.map(([_, y]) => y));
        rockHeight =
          rockHeight > BigInt(chamber.length - upperY)
            ? rockHeight
            : BigInt(chamber.length - upperY);
        groundCollision = true;

        const cacheKey = shapeIndex + jetIndex + ":" + chamber
            .slice(upperY, upperY + cacheSize)
            .flat()
            .join("");;

        if (cache[cacheKey]) {
          const [cFallenRocks, cRockHeight] = cache[cacheKey];

          const diffFallenRocks = BigInt(fallenRocks) - BigInt(cFallenRocks);
          const diffRockHeight = BigInt(rockHeight) - BigInt(cRockHeight);

          const remainingRocks = BigInt(target) - BigInt(fallenRocks);
          const repeat = BigInt(remainingRocks) / BigInt(diffFallenRocks);

          fallenRocks += repeat * diffFallenRocks;
          repeatingHeight += repeat * diffRockHeight;
        }

        if (cacheKey.length > cacheSize * chamberWidth) {
          cache[cacheKey] = [fallenRocks, rockHeight];
        }

        break;
      }

      currentShape = movedShape;
    }
  }

  return rockHeight + repeatingHeight;
}

function solve() {
  const text = readFileAsString("./input.txt");
  return simulate(text);
}

console.log(measureTime(() => solve()));

