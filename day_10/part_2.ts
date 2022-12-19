import {  readFileAsString, toLines } from "../helpers/parsing";
import { tap } from "../helpers/utils";
import { Instruction, toInstruction } from "./part_1";
import {Matrix} from "../helpers/matrix";

type Pixel = "." | "#";
type Screen = Matrix<Pixel>;

type DeviceState = {
  cycle: number;
  xRegister: number;
  screen: Screen;
};

function getScreen(width: number, height: number): Screen {
  return Array.from(new Array(height), () => new Array(width).fill("."));
}

function getScreenPixel(cycle: number) {
  return { y: Math.floor(cycle / 40), x: cycle % 40 };
}

function shouldDraw(cycle: number, xRegister: number) {
  const pixel = getScreenPixel(cycle);

  return (
    pixel.x - 1 === xRegister ||
    pixel.x === xRegister ||
    pixel.x + 1 === xRegister
  );
}

export function executeInstruction() {
  return (state: DeviceState, instruction: Instruction): DeviceState => {
    const screen = state.screen;
    if (shouldDraw(state.cycle, state.xRegister)) {
      const pixel = getScreenPixel(state.cycle);
      screen[pixel.y][pixel.x] = "#";
    }

    if (instruction.type === "noop") {
      return {
        ...state,
        cycle: state.cycle + 1,
      };
    } else {
      if (shouldDraw(state.cycle + 1, state.xRegister)) {
        const pixel = getScreenPixel(state.cycle + 1);
        screen[pixel.y][pixel.x] = "#";
      }

      return {
        ...state,
        cycle: state.cycle + 2,
        xRegister: state.xRegister + (instruction.value ?? 0),
      };
    }
  };
}

export function render(screen: Screen) {
  for (const row of screen) {
    console.log(row.join(""));
  }
}

export function solve() {
  const text = readFileAsString("./input.txt");
  return toLines(text)
    .map(toInstruction)
    .map(tap(console.log))
    .reduce<DeviceState>(executeInstruction(), {
      cycle: 0,
      xRegister: 1,
      screen: getScreen(40, 6),
    });
}

render(solve().screen);
