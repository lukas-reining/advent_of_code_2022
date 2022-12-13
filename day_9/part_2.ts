import {
  Matrix,
  readFileAsString,
  toDecimalInt,
  toLines,
} from "../helpers/parsing";
import { toSum } from "../helpers/math";
import { to } from "../helpers/mapping";

export type Instruction = { direction: "U" | "D" | "L" | "R"; fields: number };
export type Bridge = Matrix<Field>;
export type Position = { col: number; row: number };
export type Positions = {
  T1: Position;
  T2: Position;
  T3: Position;
  T4: Position;
  T5: Position;
  T6: Position;
  T7: Position;
  T8: Position;
  T9: Position;
  H: Position;
};
export type FieldType =
  | "T1"
  | "T2"
  | "T3"
  | "T4"
  | "T5"
  | "T6"
  | "T7"
  | "T8"
  | "T9"
  | "H";
export type Field = {
  state: Array<FieldType>;
  visited: boolean;
};

const MapSize = 1000;

export function initialBridge(): Bridge {
  const bridge = Array.from(new Array(MapSize), () =>
    new Array<Field>(MapSize).fill({ state: [], visited: false })
  );

  bridge[MapSize / 2][MapSize / 2] = {
    state: ["T1", "T2", "T3", "T4", "T5", "T6", "T7", "T8", "T9", "H"],
    visited: true,
  };

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

export function findCurrentHeadAndTail(bridge: Bridge): Positions {
  let result: any = {};

  for (let i = 0; i < bridge.length; i++) {
    const row = bridge[i];

    for (let j = 0; j < row.length; j++) {
      const state = row[j];
      const col = state.state as Record<string, any>;

      for (let k = 1; k < 10; k++) {
        if (col.includes(`T${k}`)) {
          result[`T${k}`] = { col: j, row: i };
        }
      }

      if (col.includes("H")) {
        result["H"] = { col: j, row: i };
      }
    }
  }

  return result as Positions;
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
    const { H, T1, T2, T3, T4, T5, T6, T7, T8, T9 } =
      findCurrentHeadAndTail(currentBridge);

    const newHead = calculateNewHeadPosition(H, currentInstruction);
    currentBridge[H.row][H.col] = {
      ...currentBridge[H.row][H.col],
      state: currentBridge[H.row][H.col].state.filter((value) => value !== "H"),
    };

    currentBridge[newHead.row][newHead.col] = {
      ...currentBridge[newHead.row][newHead.col],
      state: [...currentBridge[newHead.row][newHead.col].state, "H"],
    };

    [T1, T2, T3, T4, T5, T6, T7, T8, T9].reduce(
      (toFollow, currentTail, index) => {
        const newTail = calculateNewTailPosition(toFollow, currentTail);

        currentBridge[currentTail.row][currentTail.col] = {
          ...currentBridge[currentTail.row][currentTail.col],
          state: currentBridge[currentTail.row][currentTail.col].state.filter(
            (value) => value !== `T${index + 1}`
          ),
        };

        currentBridge[newTail.row][newTail.col] = {
          state: [
            ...currentBridge[newTail.row][newTail.col].state,
            `T${index + 1}` as FieldType,
          ],
          visited:
            index === 8
              ? true
              : currentBridge[newTail.row][newTail.col].visited,
        };

        return newTail;
      },
      newHead
    );

    return currentBridge;
  }, bridge);
}

export function doMoves(bridge: Bridge, instructions: Instruction[]) {
  return instructions.reduce((currentBridge, instruction, index) => {
    console.log(`Doing instruction ${index}`)
    return doMove(currentBridge, instruction);
  }, bridge);
}

export function printBridge(bridge: Bridge) {
  const reversedBridge = [...bridge];
  reversedBridge.reverse();

  const bridgeText = reversedBridge
    .map((row) =>
      row
        .map(to("state"))
        .map((state) => {
          if (state.includes("H")) {
            return "H";
          } else if (state.includes("T1")) {
            return "1";
          } else if (state.includes("T2")) {
            return "2";
          } else if (state.includes("T3")) {
            return "3";
          } else if (state.includes("T4")) {
            return "4";
          } else if (state.includes("T5")) {
            return "5";
          } else if (state.includes("T6")) {
            return "6";
          } else if (state.includes("T7")) {
            return "7";
          } else if (state.includes("T8")) {
            return "8";
          } else if (state.includes("T9")) {
            return "9";
          } else {
            return ".";
          }
        })
        .join("")
    )
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