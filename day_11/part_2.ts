import { readFileAsString, toDecimalInt } from "../helpers/parsing";
import { to } from "../helpers/mapping";
import { numbersDescending } from "../helpers/sort";
import { toProduct } from "../helpers/math";
import { Monkeys, toMonkey, toMonkeyDescriptions } from "./part_1";

function monkeyLargestCommonMultiplier(monkeys: Monkeys) {
  return Object.values(monkeys).map(to("divisor")).reduce(toProduct, 1);
}

function executeMonkeyRound(
  monkeyNumber: number,
  monkeys: Monkeys,
  lcm: number
): Monkeys {
  const monkey = monkeys[monkeyNumber];
  const monkeyItems = monkey.items;
  monkey.items = [];

  return monkeyItems.reduce((newMonkeys, item) => {
    const newItem = monkey.operation(item) % lcm;

    const passesTest = monkey.test(newItem);
    const throwTo = passesTest ? monkey.throwTo.ifTrue : monkey.throwTo.ifFalse;

    monkey.inspections += 1;
    monkeys[throwTo].items.push(newItem);
    return newMonkeys;
  }, monkeys);
}

function executeFullRound(monkeys: Monkeys, lcm: number) {
  return Object.keys(monkeys).reduce(
    (newMonkeys, monkeyNumber) =>
      executeMonkeyRound(toDecimalInt(monkeyNumber), newMonkeys, lcm),
    monkeys
  );
}

function executeRounds(monkeys: Monkeys, rounds: number = 20): Monkeys {
  const lcm = monkeyLargestCommonMultiplier(monkeys);
  return Array.from(new Array(rounds), (_, index) => index).reduce(
    (monkeys, round) => executeFullRound(monkeys, lcm),
    monkeys
  );
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
  return executeRounds(monkeys, 10000);
}

const result = solve();
console.log(getMonkeyBusinessLevel(result));