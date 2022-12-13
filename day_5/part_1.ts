import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";

export type Ship = Record<number, string[]>;
export type Move = { from: number; to: number; amount: number };

export function newInputShip() {
  return {
    1: ["L", "N", "W", "T", "D"],
    2: ["C", "P", "H"],
    3: ["W", "P", "H", "N", "D", "G", "M", "J"],
    4: ['C', 'W', 'S', 'N', 'T', 'Q', 'L'],
    5: ["P", "H", "C", "N"],
    6: ["T", "H", "N", "D", "M", "W", "Q", "B"],
    7: ["M", "B", "R", "J", "G", "S", "L"],
    8: ["Z", "N", "W", "G", "V", "B", "R", "T"],
    9: ["W", "G", "D", "N", "P", "L"],
  };
}

export function toMove(line: string): Move {
  const result = [...line.matchAll(/^move (\d+) from (\d+) to (\d+)$/g)];
  return {
    from: toDecimalInt(result[0][2]),
    to: toDecimalInt(result[0][3]),
    amount: toDecimalInt(result[0][1]),
  };
}

export function executeMove(isCrateMover9001: boolean) {
  return (currentShip: Ship, move: Move) : Ship=> {
    const itemsToMove = currentShip[move.from].splice(-move.amount);

    if(!isCrateMover9001){
      itemsToMove.reverse()
    }

    currentShip[move.to].push(...itemsToMove);
    return currentShip;
  }
}

export function getTopItems(ship: Ship) {
  return Object.values(ship).reduce((items, stack) => {
    return items + stack[stack.length - 1];
  }, "");
}

export function solve() {
  const text = readFileAsString("./move_input.txt");
  const newShip = toLines(text).map(toMove).reduce(executeMove(false), newInputShip());
  return getTopItems(newShip);
}

console.log(solve());