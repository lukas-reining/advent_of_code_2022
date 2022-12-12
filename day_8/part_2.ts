import { Matrix, readFileAsString, toDecimalMatrix } from "../helpers/parsing";
import { column } from "./part_1";
import { numbersDescending } from "../helpers/sort";

export function calculateScenicScore(row: number[], value: number) {
  return row.reduce<number[]>((values, currentValue) => {
    if (values.length === 0 || values[values.length - 1] < value) {
      values.push(currentValue);
    }
    return values;
  }, []).length;
}

export function findBestScenicScore(matrix: Matrix<number>) {
  return matrix.flat().sort(numbersDescending)[0];
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const map = toDecimalMatrix(text);

  return map.reduce((visibilityMatrix, colum, columnIndex, mapMatrix) => {
    return [
      ...visibilityMatrix,
      colum.map<number>((height, rowIndex, mapRow) => {
        const leftScenicScore = calculateScenicScore(
          mapRow.slice(0, rowIndex).reverse(),
          height
        );
        const rightScenicScore = calculateScenicScore(
          mapRow.slice(rowIndex + 1),
          height
        );

        const topScenicScore = calculateScenicScore(
          column(mapMatrix, rowIndex).slice(0, columnIndex).reverse(),
          height
        );

        const bottomScenicScore = calculateScenicScore(
          column(mapMatrix, rowIndex).slice(columnIndex + 1),
          height
        );

        return (
          bottomScenicScore *
          topScenicScore *
          leftScenicScore *
          rightScenicScore
        );
      }),
    ];
  }, new Array<number[]>());
}

const scenicScoreMap = solve();

console.log(findBestScenicScore(scenicScoreMap));
