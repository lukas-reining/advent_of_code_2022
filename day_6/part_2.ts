import { readFileAsString } from "../helpers/parsing";
import { findFirstMarkerPacket, withOnlyDistinctCharacters } from "./part_1";

export function solve() {
  const stream = readFileAsString("./input.txt");
  return findFirstMarkerPacket(stream, 14).find(withOnlyDistinctCharacters);
}

console.log(solve());