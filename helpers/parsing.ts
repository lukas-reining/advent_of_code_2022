import * as fs from "fs";

export function readFileAsString(path: string) {
  return fs.readFileSync(path, "utf-8");
}

export function toLines(text: string) {
  return text.split("\n");
}

export function toDecimalInt(number: string) {
  return Number.parseInt(number, 10);
}
