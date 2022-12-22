import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";
import { measureTime } from "../helpers/time";

export type Node = {
  name: string;
  pressure: number;
  open: boolean;
  connections: string[];
};

type TunnelMap = Map<string, Omit<Node, "name">>;

export function toNode(line: string): Node {
  const valveMatches = [
    ...line.matchAll(
      /^Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? ((\w+,?\s?)*)$/gm
    ),
  ];

  return {
    name: valveMatches[0][1],
    pressure: toDecimalInt(valveMatches[0][2]),
    open: false,
    connections: valveMatches[0][3].split(/,\s*/),
  };
}

export function distanceMemoKey(currValve: string, targetValve: string) {
  return currValve < targetValve
    ? currValve + targetValve
    : targetValve + currValve;
}

function maxPressure(
  currValve: string,
  timeLeft: number,
  contesters: string[],
  map: TunnelMap
) {
  let optimalValve = null;
  let value = 0;

  for (let contester of contesters) {
    let newContesters = [...contesters].filter((v) => v !== contester);
    let newTime = timeLeft - distanceTo(currValve, contester, map) - 1;

    if (newTime <= 0) {
      continue;
    }

    let score = newTime * map.get(contester)!.pressure;
    let optimal = maxPressure(contester, newTime, newContesters, map);
    score += optimal.value;

    if (score > value) {
      optimalValve = contester;
      value = score;
    }
  }

  return { optimalValve, value };
}

const distanceMemo = new Map();

function distanceTo(currValve: string, targetValve: string, map: TunnelMap) {
  let key = distanceMemoKey(currValve, targetValve);
  if (distanceMemo.has(key)) {
    return distanceMemo.get(key);
  }

  let visisted = new Set();
  let queue = [currValve];
  let traveled = 0;

  while (queue.length > 0) {
    let nextQueue = [];
    for (let valve of queue) {
      if (visisted.has(valve)) {
        continue;
      }

      visisted.add(valve);
      if (valve === targetValve) {
        distanceMemo.set(key, traveled);
        return traveled;
      }

      for (let neighbor of map.get(valve)!.connections) {
        nextQueue.push(neighbor);
      }
    }

    queue = nextQueue;
    traveled++;
  }
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const nodes = toLines(text).map(toNode);

  const map = nodes.reduce<TunnelMap>((map, { name, ...node }) => {
    return map.set(name, node);
  }, new Map());

  const possibleNodes = [...map.keys()].filter(
    (valve) => map.get(valve)!.pressure > 0
  );

  return maxPressure("AA", 30, possibleNodes, map).value;
}

console.log(measureTime(() => solve()));