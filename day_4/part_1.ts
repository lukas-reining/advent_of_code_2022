import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";

export type Section = [number, number];
export type SectionPair = [Section, Section];

export function toSections(line: string): SectionPair {
  const [section1, section2] = line.split(",");

  const section1Numbers = section1.split("-");
  const section2Numbers = section2.split("-");

  const [section1Start, section1End, section2Start, section2End] = [
    ...section1Numbers,
    ...section2Numbers,
  ].map(toDecimalInt);

  return [
    [section1Start, section1End],
    [section2Start, section2End],
  ];
}

function contains(
  [section1Start, section1End]: Section,
  [section2Start, section2End]: Section
) {
  return section1Start <= section2Start && section1End >= section2End;
}

function oneIsFullyContained([section1, section2]: SectionPair) {
  return contains(section1, section2) || contains(section2, section1);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  return toLines(text).map(toSections).filter(oneIsFullyContained).length;
}

console.log(solve());