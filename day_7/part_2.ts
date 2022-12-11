import { readFileAsString, toLines } from "../helpers/parsing";
import { buildFileTree, Folder, toTermialLines } from "./part_1";

export function isSmallerButFits(
  currentLowest: Folder,
  folder: Folder,
  spaceToFree: number
) {
  return currentLowest.size > folder.size && folder.size >= spaceToFree;
}

export function findLowestPossibleFolder(
  folder: Folder,
  spaceToFree: number
): Folder {
  let currentLowest = folder;
  for (const currentFolder of folder.subfolders) {
    const lowestOfSubfolder = findLowestPossibleFolder(
      currentFolder,
      spaceToFree
    );

    if (
      currentFolder.type === "folder" &&
      isSmallerButFits(currentLowest, lowestOfSubfolder, spaceToFree)
    ) {
      currentLowest = lowestOfSubfolder;
    }
  }
  return currentLowest;
}



export function findFolderToDelete(folder: Folder): Folder {
  const spaceToFree = 30000000 - (70000000 - folder.size);
  return findLowestPossibleFolder(folder, spaceToFree);
}

export function solve() {
  const text = readFileAsString("./input.txt");
  const lines = toLines(text);
  const terminalLines = toTermialLines(lines);

  return buildFileTree(terminalLines);
}

const { name, size } = findFolderToDelete(solve());

console.log({ name, size });
