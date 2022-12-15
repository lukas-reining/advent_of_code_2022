import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";
import { tap } from "../helpers/utils";
import { toSum } from "../helpers/math";

export type InstructionType = "noop" | "addx";
export type Instruction = { type: InstructionType; value?: number };
export type CpuState = {
  cycle: number;
  xRegister: number;
  signalStrengths: number[];
};

export function toInstruction(line: string): Instruction {
  const result = [...line.matchAll(/^((?:noop)|(?:addx))\s*(-?\d+)?$/g)];
  return {
    type: result[0][1] as InstructionType,
    value: toDecimalInt(result[0][2]),
  };
}

export function isStep(cycle: number) {
  return (cycle - 20) % 40 === 0;
}

export function executeInstruction() {
  return (state: CpuState, instruction: Instruction): CpuState => {
    if (instruction.type === "noop") {
      const xRegisterSteps = isStep(state.cycle + 1)
        ? [...state.signalStrengths, state.xRegister * (state.cycle + 1)]
        : state.signalStrengths;

      return {
        ...state,
        signalStrengths: xRegisterSteps,
        cycle: state.cycle + 1,
      };
    } else {
      const xRegister = state.xRegister + (instruction.value ?? 0);
      const xRegisterSteps = isStep(state.cycle + 1)
        ? [...state.signalStrengths, state.xRegister * (state.cycle + 1)]
        : isStep(state.cycle + 2)
        ? [...state.signalStrengths, state.xRegister * (state.cycle + 2)]
        : state.signalStrengths;

      return {
        cycle: state.cycle + 2,
        signalStrengths: xRegisterSteps,
        xRegister,
      };
    }
  };
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const state = toLines(text)
    .map(toInstruction)
    .map(tap(console.log))
    .reduce<CpuState>(executeInstruction(), {
      cycle: 0,
      xRegister: 1,
      signalStrengths: [],
    });

  return state.signalStrengths.reduce(toSum, 0);
}

console.log(solve());
