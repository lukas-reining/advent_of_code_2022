import { readFileAsString, toDecimalInt } from "../helpers/parsing";
import { to } from "../helpers/mapping";
import { numbersDescending } from "../helpers/sort";
import { toProduct } from "../helpers/math";

export type Monkey = {
  items: number[];
  inspections: number;
  operation: (item: number) => number;
  test: (item: number) => boolean;
  divisor: number;
  throwTo: {
    ifTrue: number;
    ifFalse: number;
  };
};
export type Monkeys = Record<number, Monkey>;

export function toMonkeyDescriptions(text: string) {
  return text.split("\n\n");
}

export function getStartingItems(text: string) {
  const itemList = [...text.matchAll(/Starting items:\s*((\d+,?\s)*)/gm)][0][1];
  return itemList.split(/,\s*/).map(toDecimalInt);
}

export function getOperation(text: string) {
  const operation = [...text.matchAll(/Operation:\s*(new\s+=\s+(.*))/gm)][0][2];
  return (value: number) => eval(`(old) => ${operation}`)(value);
}

export function getTest(text: string) {
  const divisibleBy = [...text.matchAll(/Test: divisible by (\d+)/gm)][0][1];
  const divisor = toDecimalInt(divisibleBy);
  return { test: (value: number) => value % divisor === 0, divisor };
}

export function getThrowTo(text: string) {
  const throwTo = [
    ...text.matchAll(
      /If true:\s*(?:[\w|\s]+)\s*(\d+)\s*\n\s*If false:\s*(?:[\w|\s]+)\s*(\d+)/gm
    ),
  ][0];
  return {
    ifTrue: toDecimalInt(throwTo[1]),
    ifFalse: toDecimalInt(throwTo[2]),
  };
}

export function toMonkey(text: string): Monkey {
  const { test, divisor } = getTest(text);

  return {
    items: getStartingItems(text),
    inspections: 0,
    operation: getOperation(text),
    throwTo: getThrowTo(text),
    divisor,
    test,
  };
}

function executeMonkeyRound(monkeyNumber: number, monkeys: Monkeys): Monkeys {
  const monkey = monkeys[monkeyNumber];
  const monkeyItems = monkey.items;
  monkey.items = [];

  return monkeyItems.reduce((newMonkeys, item) => {
    const newItem = Math.floor(monkey.operation(item) / 3);

    const passesTest = monkey.test(newItem);
    const throwTo = passesTest ? monkey.throwTo.ifTrue : monkey.throwTo.ifFalse;

    monkey.inspections += 1;
    monkeys[throwTo].items.push(newItem);
    return newMonkeys;
  }, monkeys);
}

function executeFullRound(monkeys: Monkeys) {
  return Object.keys(monkeys).reduce(
    (newMonkeys, monkeyNumber) =>
      executeMonkeyRound(toDecimalInt(monkeyNumber), newMonkeys),
    monkeys
  );
}

function executeRounds(monkeys: Monkeys, rounds: number = 20): Monkeys {
  return new Array(rounds).fill(null).reduce(executeFullRound, monkeys);
}

function getMonkeyBusinessLevel(monkeys: Monkeys): number {
  return Object.values(monkeys)
    .map(to("inspections"))
    .sort(numbersDescending)
    .slice(0, 2)
    .reduce(toProduct, 1);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const monkeys = toMonkeyDescriptions(text).map(toMonkey);
  return executeRounds(monkeys, 20);
}

console.log(getMonkeyBusinessLevel(solve()));
