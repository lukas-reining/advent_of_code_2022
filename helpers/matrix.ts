import { toDecimalInt } from "./parsing";

export type Matrix<T> = T[][];

export type CharacterMatrix = Matrix<string>;

export function toCharacterMatrix(input: string): CharacterMatrix {
  return input.split("\n").map((line) => line.split(""));
}

export type DecimalMatrix = Matrix<number>;

export function toDecimalMatrix(input: string): DecimalMatrix {
  return input.split("\n").map((line) => line.split("").map(toDecimalInt));
}

export function createMatrix<T>(
  fill: T,
  width: number,
  height?: number
): Matrix<T> {
  return Array.from(new Array(height), () => new Array<T>(width).fill(fill));
}
