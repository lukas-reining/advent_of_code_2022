import { readFileAsString } from "../helpers/parsing";

type Packet = { start: number; packet: string };

export function onlyDistinctCharacters(string: string) {
  return new Set(string).size == string.length;
}

export function withOnlyDistinctCharacters(packet: Packet) {
  return onlyDistinctCharacters(packet.packet);
}

export function findFirstMarkerPacket(stream: string, distinctChars: number) {
  return stream.split("").reduce((candidates, _, index) => {
    if (index - distinctChars < 0) {
      return candidates;
    }

    return [
      ...candidates,
      { start: index, packet: stream.substring(index - distinctChars, index) },
    ];
  }, new Array<Packet>());
}

export function solve() {
  const stream = readFileAsString("./input.txt");
  return findFirstMarkerPacket(stream, 4).find(withOnlyDistinctCharacters);
}

console.log(solve());
