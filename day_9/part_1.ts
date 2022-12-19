import {
  readFileAsString,
  toDecimalInt,
  toLines,
} from "../helpers/parsing";
import { toSum } from "../helpers/math";
import { to } from "../helpers/mapping";
import {Matrix} from "../helpers/matrix";

export type Position = { col: number; row: number };
export type Field = { state: "." | "S" | "T" | "H"; visited: boolean };
export type Bridge = Matrix<Field>;
export type Instruction = { direction: "U" | "D" | "L" | "R"; fields: number };

const MapSize = 1000;
const StartingPoint = Math.floor(MapSize / 2)

export function initialBridge(): Bridge {
  const bridge = Array.from(new Array(MapSize), () =>
    new Array<Field>(MapSize).fill({ state: ".", visited: false })
  );

  bridge[StartingPoint][StartingPoint] = { state: "S", visited: true };

  return bridge;
}

export function toInstructions(lines: string[]): Instruction[] {
  return lines
    .map((line) => line.split(/\s/))
    .map(
      ([direction, fields]) =>
        ({ direction, fields: toDecimalInt(fields) } as Instruction)
    );
}

export function findCurrentHeadAndTail(bridge: Bridge): {
  head: Position;
  tail: Position;
} {
  let head = null;
  let tail = null;

  for (let i = 0; i < bridge.length; i++) {
    const row = bridge[i];

    for (let j = 0; j < row.length; j++) {
      const { state: col } = row[j];
      if (col === "S") {
        head = { col: j, row: i };
        tail = { col: j, row: i };
      } else if (col === "T") {
        tail = { col: j, row: i };
      } else if (col === "H") {
        head = { col: j, row: i };
      }
    }
  }

  if (head === null && tail !== null) {
    return { head: tail, tail };
  } else if (head !== null && tail === null) {
    return { head, tail: head };
  } else if (head !== null && tail !== null) {
    return { head, tail };
  }

  throw new Error("Head or Tail not found");
}

export function calculateNewHeadPosition(
  position: Position,
  instruction: Instruction
): Position {
  if (instruction.direction === "U") {
    return {
      row: position.row + instruction.fields,
      col: position.col,
    };
  } else if (instruction.direction === "D") {
    return {
      row: position.row - instruction.fields,
      col: position.col,
    };
  } else if (instruction.direction === "L") {
    return {
      row: position.row,
      col: position.col - instruction.fields,
    };
  } else if (instruction.direction === "R") {
    return {
      row: position.row,
      col: position.col + instruction.fields,
    };
  }

  throw new Error("Invalid instruction");
}

export function calculateNewTailPosition(
  headPosition: Position,
  tailPosition: Position
): Position {
  const rowOffset = headPosition.row - tailPosition.row;
  const columnOffset = headPosition.col - tailPosition.col;

  const newPosition = { col: tailPosition.col, row: tailPosition.row };

  if (
    rowOffset != 0 &&
    columnOffset != 0 &&
    Math.abs(rowOffset) + Math.abs(columnOffset) === 3
  ) {
    if (Math.abs(rowOffset) === 2) {
      newPosition.col = headPosition.col;
    }
    if (Math.abs(columnOffset) === 2) {
      newPosition.row = headPosition.row;
    }
  }

  if (rowOffset > 1) {
    newPosition.row += 1;
  } else if (rowOffset < -1) {
    newPosition.row -= 1;
  }

  if (columnOffset > 1) {
    newPosition.col += 1;
  } else if (columnOffset < -1) {
    newPosition.col -= 1;
  }

  return newPosition;
}

export function doMove(bridge: Bridge, instruction: Instruction) {
  const atomicInstructions = Array.from(new Array(instruction.fields), () => ({
    direction: instruction.direction,
    fields: 1,
  }));

  return atomicInstructions.reduce((currentBridge, currentInstruction) => {
    const { head, tail } = findCurrentHeadAndTail(currentBridge);

    const newHead = calculateNewHeadPosition(head, currentInstruction);
    const newTail = calculateNewTailPosition(newHead, tail);

    currentBridge[head.row][head.col] = {
      ...currentBridge[head.row][head.col],
      state: ".",
    };

    currentBridge[tail.row][tail.col] = {
      ...currentBridge[tail.row][tail.col],
      state: ".",
    };

    currentBridge[newHead.row][newHead.col] = {
      ...currentBridge[newHead.row][newHead.col],
      state: "H",
    };

    currentBridge[newTail.row][newTail.col] = {
      state: "T",
      visited: true,
    };

    return currentBridge;
  }, bridge);
}

export function doMoves(bridge: Bridge, instructions: Instruction[]) {
  return instructions.reduce((currentBridge, instruction, index) => {
    return doMove(currentBridge, instruction);
  }, bridge);
}

export function printBridge(bridge: Bridge) {
  const reversedBridge = [...bridge];
  reversedBridge.reverse();

  const bridgeText = reversedBridge
    .map((row) => row.map(to("state")).join(""))
    .join("\n");

  console.log("Bridge:");
  console.log(bridgeText);
  console.log();
}

export function countVisits(bridge: Bridge) {
  return bridge
    .flat()
    .map((field) => (field.visited ? 1 : 0))
    .reduce(toSum, 0);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const lines = toLines(text);
  const instructions = toInstructions(lines);
  const bridge = initialBridge();

  const result = doMoves(bridge, instructions);
  printBridge(result);

  return result;
}

const result = solve();
console.log(countVisits(result));