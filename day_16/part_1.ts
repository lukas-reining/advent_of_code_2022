import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";

export type Node = {
  name: string;
  pressure: number;
  open: boolean;
  connections: string[];
};

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

const cache: Record<string, any> = {};
let lastLog = 0

export function maxPressure(
  nodes: Node[],
  nodeName: string,
  opened: string[] = [],
  timeLeft: number
) {
  if(performance.now() > lastLog + 1000){
    lastLog = performance.now()
    console.log(lastLog)
  }

  if (timeLeft <= 0) {
    return 0;
  }

  const currentNode = nodes.find((node) => node.name === nodeName);

  if(!currentNode){
    return 0
  }

  const currentRelease = (timeLeft - 1) * currentNode!.pressure;
  const key = nodeName + opened.join("") + timeLeft;

  let best = 0;
  for (const next of currentNode!.connections) {
    if (cache[key]) {
      return cache[key];
    }

    if (currentRelease != 0 && !opened.includes(nodeName)) {
      const nextRelease = maxPressure(
        nodes,
        next,
        [...opened, nodeName],
        timeLeft - 2
      );
      best = Math.max(best, currentRelease + nextRelease);
    }

    best = Math.max(best, maxPressure(nodes, next, opened, timeLeft - 1));
  }

  cache[key] = best;
  return best;
}

export function solve() {
  const text = readFileAsString("./example_input.txt");
  const nodes = toLines(text).map(toNode).filter((node) => node.pressure);

  return maxPressure(nodes, "AA", [], 30);
}

console.log(solve())