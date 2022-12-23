import { Shape } from "./part_1";

export const Shapes: Shape[] = [
  [
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
  ],
  [
    [1, 0],
    [0, 1],
    [1, 1],
    [2, 1],
    [1, 2],
  ],
  [
    [2, 0],
    [2, 1],
    [0, 2],
    [1, 2],
    [2, 2],
  ],
  [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ],
  [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
  ],
];

export function* shapes(start: number = 0): Generator<{index: number, shape: Shape}, {index: number, shape: Shape}> {
  let index = start;

  while (true) {
    const nextValue = index % Shapes.length;
    index += 1;
    yield { index: nextValue, shape: [...Shapes[nextValue]] };
  }
}
