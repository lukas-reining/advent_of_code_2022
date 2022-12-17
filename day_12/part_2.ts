import {
  Matrix,
  readFileAsString,
  toCharacterMatrix,
} from "../helpers/parsing";
import { isDefined, whereEquals } from "../helpers/filter";
import { buildGraph, Field, NodeMatrix } from "./part_1";
import { to } from "../helpers/mapping";
import {numbersAscending, numbersDescending} from "../helpers/sort";

export function findPathFromBestStartingPoint(nodeMatrix: Matrix<Field>) {
  const nodes = nodeMatrix.flat();
  const graph = buildGraph(nodeMatrix);

  const starts = nodes.filter(whereEquals("elevation", "a"));
  const end = nodes.find(whereEquals("elevation", "E"));

  return (
    starts
      .map(
        (start) => graph.path(start!.coordinates, end!.coordinates) as string[]
      )
      .filter(isDefined)
      .map(to("length"))
      .sort(numbersAscending)[0] - 1
  );
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const matrix = toCharacterMatrix(text);
  const nodes = NodeMatrix(matrix);
  return findPathFromBestStartingPoint(nodes);
}
console.log(solve())