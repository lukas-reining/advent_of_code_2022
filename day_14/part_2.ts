import {readFileAsString, toLines} from "../helpers/parsing";
import {dropSand, printCave, toCave, toPath} from "./part_1";
import {measureTime} from "../helpers/time";

export function solve() {
    const text = readFileAsString("./input.txt");
    const paths = toLines(text).map(toPath);
    const cave = toCave(paths, true);

    let steps = 1;
    while (!dropSand(cave).finished) {
        steps++;
    }

    printCave(cave);
    return steps;
}

const result = measureTime(() => solve());
console.log(result);
