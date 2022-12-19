import { readFileAsString } from "../helpers/parsing";
import { toSum } from "../helpers/math";
import {DecimalMatrix, Matrix, toDecimalMatrix} from "../helpers/matrix";

export function isLargest(row: number[], value: number) {
  return row.every((currentValue) => currentValue < value);
}

export function column(matrix: DecimalMatrix, number: number) {
  return matrix.map(function (value, index) {
    return value[number];
  });
}

export function countVisible(matrix: Matrix<boolean>) {
  return matrix
    .flatMap((row) => row.map((visible) => (visible ? 1 : 0)))
    .reduce(toSum, 0);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const map = toDecimalMatrix(text);

  return map.reduce((visibilityMatrix, colum, columnIndex, mapMatrix) => {
    return [
      ...visibilityMatrix,
      colum.map<boolean>((height, rowIndex, mapRow) => {
        const visibleFromLeft = isLargest(mapRow.slice(0, rowIndex), height);
        const visibleFromRight = isLargest(mapRow.slice(rowIndex + 1), height);

        const visibleFromTop = isLargest(
          column(mapMatrix, rowIndex).slice(0, columnIndex),
          height
        );

        const visibleFromBottom = isLargest(
          column(mapMatrix, rowIndex).slice(columnIndex + 1),
          height
        );

        return (
          visibleFromBottom ||
          visibleFromTop ||
          visibleFromLeft ||
          visibleFromRight
        );
      }),
    ];
  }, new Array<boolean[]>());
}

const visibilityMap = solve();

console.log(countVisible(visibilityMap));

