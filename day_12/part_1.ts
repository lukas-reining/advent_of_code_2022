import {
  CharacterMatrix,
  Matrix,
  readFileAsString,
  toCharacterMatrix,
} from "../helpers/parsing";

import { isDefined, whereEquals } from "../helpers/filter";
import Graph from "node-dijkstra";

export class Field {
  constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly elevation: string
  ) {}

  public get coordinates() {
    return `${this.x}:${this.y}`;
  }

  public get height() {
    if (this.elevation === "S") {
      return 0;
    } else if (this.elevation === "E") {
      return 26;
    }

    return this.elevation.charCodeAt(0) - "a".charCodeAt(0);
  }

  public canVisit(node: Field) {
    return node.height - this.height  <= 1;
  }
}

export function NodeMatrix(matrix: CharacterMatrix): Matrix<Field> {
  return matrix.reduce((newMatrix, row, y) => {
    const newRow = row.map((char, x) => new Field(x, y, char));
    return [...newMatrix, newRow];
  }, new Array<Field[]>());
}

export function canVisit(node1: Field) {
  return (node2: Field) => node1.canVisit(node2);
}

export function buildGraph(nodeMatrix: Matrix<Field>) {
  const graph = new Graph();

  for (let i = 0; i < nodeMatrix.length; i++) {
    for (let j = 0; j < nodeMatrix[i].length; j++) {
      const current = nodeMatrix[i][j];
      const left = nodeMatrix[i] && nodeMatrix[i][j - 1];
      const right = nodeMatrix[i] && nodeMatrix[i][j + 1];
      const up = nodeMatrix[i - 1] && nodeMatrix[i - 1][j];
      const down = nodeMatrix[i + 1] && nodeMatrix[i + 1][j];

      const visitableNodes = [left, right, up, down]
        .filter(isDefined)
        .filter(canVisit(current));

      const neighbours = visitableNodes.reduce(
        (neigbours, node) => ({
          ...neigbours,
          [node.coordinates]: 1,
        }),
        {}
      );
      graph.addNode(current.coordinates, neighbours);
    }
  }

  return graph;
}

export function findPathFromStartToEnd(nodeMatrix: Matrix<Field>) {
  const nodes = nodeMatrix.flat();
  const start = nodes.find(whereEquals("elevation", "S"));
  const end = nodes.find(whereEquals("elevation", "E"));

  const graph = buildGraph(nodeMatrix);
  return graph.path(start!.coordinates, end!.coordinates) as string[];
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const matrix = toCharacterMatrix(text);
  const nodes = NodeMatrix(matrix)
  return findPathFromStartToEnd(nodes).length - 1;
}

// console.log(solve());
