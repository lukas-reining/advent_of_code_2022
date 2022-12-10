import { readFileAsString, toLines } from "../helpers/parsing";
import { toSections } from "./part_1";

export type Section = [number, number];
export type SectionPair = [Section, Section];

function areOverlappping([
  [section1Start, section1End],
  [section2Start, section2End],
]: SectionPair) {
  return (
    (section1Start <= section2Start && section2Start <= section1End) ||
    (section2Start <= section1Start && section1Start <= section2End)
  );
}

export function solve() {
  const text = readFileAsString("./input.txt");
  return toLines(text).map(toSections).filter(areOverlappping).length;
}

console.log(solve());