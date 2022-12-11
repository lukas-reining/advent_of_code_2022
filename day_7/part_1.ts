import { readFileAsString, toDecimalInt, toLines } from "../helpers/parsing";
import { indentString } from "../helpers/string";
import { to } from "../helpers/mapping";
import { toSum } from "../helpers/math";

export type Command = {
  type: "ls" | "cd";
  argument: string;
};

export type Output = {
  type: "file" | "dir";
  name: string;
  size: number;
};

export type TerminalLine = Command | Output;

export type Folder = {
  name: string;
  size: number;
  type: "file" | "folder";
  subfolders: Folder[];
};

export function toTermialLines(lines: string[]): TerminalLine[] {
  const commandRegex = /^\$\s+(\w+)\s*(.*)$/g;
  const fileRegex = /^(\d+)\s+(.+)$/g;
  const dirRegex = /^dir\s+(.+)$/g;

  return lines.map((line) => {
    const commandMatches = [...line.matchAll(commandRegex)];
    const fileMatches = [...line.matchAll(fileRegex)];
    const dirMatches = [...line.matchAll(dirRegex)];

    if (commandMatches[0]) {
      const [_, type, argument] = commandMatches[0];
      return { type: type, argument } as Command;
    } else if (fileMatches[0]) {
      const [_, size, name] = fileMatches[0];
      return { type: "file", name: name, size: toDecimalInt(size) };
    } else if (dirMatches[0]) {
      const [_, name] = dirMatches[0];
      return { type: "dir", name: name, size: 0 };
    } else {
      throw Error(`Unsupported line ${line}`);
    }
  });
}

function recalculateSize(folder: Folder) {
  if (folder.type !== "folder") {
    return folder;
  }

  folder.subfolders = folder.subfolders.map(recalculateSize);
  folder.size = folder.subfolders.map(to("size")).reduce(toSum, 0);

  return folder;
}

export function buildFileTree(lines: TerminalLine[]): Folder {
  const stack: Folder[] = [];

  for (const line of lines) {
    const currentFolder = stack[stack.length - 1];

    if (line.type === "cd" && line.argument === "..") {
      stack.pop();
    } else if (line.type === "cd") {
      const newFolder = {
        name: line.argument,
        type: "folder",
        size: 0,
        subfolders: [],
      } as Folder;

      if (currentFolder) {
        currentFolder.subfolders.push(newFolder);
      }

      stack.push(newFolder);
    } else if (line.type === "file") {
      currentFolder.subfolders.push({
        name: line.name,
        type: "file",
        size: line.size,
        subfolders: [],
      });
    } else if (line.type === "dir") {
    } else if (line.type === "ls") {
    }
  }

  return recalculateSize(stack[0]);
}

export function sumAllFoldersBelow(folder: Folder): number {
  let sum = 0;

  for (const subFolder of folder.subfolders) {
    sum = sum + sumAllFoldersBelow(subFolder) ?? 0;
  }

  if (folder.size <= 100000 && folder.type === "folder") {
    sum += folder.size;
  }

  return sum;
}

export function logTree(folder: Folder, indent = 0) {
  const type = `(${folder.type}, ${folder.size})`;
  console.log(indentString(`- ${folder.name} ${type}`, indent));
  folder.subfolders.forEach((subFolder) => logTree(subFolder, indent + 2));
}

export function solve() {
  const text = readFileAsString("./example_input.txt");
  const lines = toLines(text);

  const terminalLines = toTermialLines(lines);
  const tree = buildFileTree(terminalLines);

  logTree(tree);

  return tree;
}

console.log(sumAllFoldersBelow(solve()));

