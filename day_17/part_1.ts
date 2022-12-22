import { shapes } from "./shapes";
import { readFileAsString } from "../helpers/parsing";
import { measureTime } from "../helpers/time";

export type ChamberField = "." | "#";
export type Chamber = ChamberField[][];
export type Shape = [number, number][];

const chamberWidth = 7;

function* jets(jetInput: string): Generator<string> {
  let index = 0;

  while (true) {
    const nextValue = index % jetInput.length;
    index += 1;
    yield jetInput[nextValue];
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
  let rockHeight = 0;
  let fallenRocks = 0;

  while (fallenRocks < 2022) {
    let currentShape = shape.next().value;

    const shapeHeight1 = shapeHeight(currentShape);
    chamber = addRows(shapeHeight1, chamber);

    const yOffset = chamber.length - rockHeight - 3;
    currentShape = move(currentShape, 2, yOffset - shapeHeight1);

    let groundCollision = false;
    while (!groundCollision) {
      const currentJet = jet.next().value;

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
        fallenRocks += 1;
        const upperY = Math.min(...currentShape.map(([_, y]) => y));
        rockHeight = Math.max(rockHeight, chamber.length - upperY);
        groundCollision = true;
        break;
      }

      currentShape = movedShape;
    }
  }

  printChamber(chamber);

  return rockHeight;
}

function solve() {
  const text = readFileAsString("./input.txt");
  return simulate(text);
}

console.log(measureTime(() => solve()));
