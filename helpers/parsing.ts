import * as fs from "fs";

export function readFileAsString(path: string) {
  return fs.readFileSync(path, "utf-8");
}

export function toLines(text: string) {
  return text.split("\n");
}

export type Matrix<T> = T[][]

export type CharacterMatrix = Matrix<string>
export function toCharacterMatrix(input: string): CharacterMatrix {
  return input.split("\n").map((line) => line.split(""));
}

export type DecimalMatrix = Matrix<number>
export function toDecimalMatrix(input: string): DecimalMatrix {
  return input.split("\n").map((line) => line.split("").map(toDecimalInt));
}

export function toDecimalInt(number: string) {
  return Number.parseInt(number, 10);
}
