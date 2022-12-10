export function indentString(string: string, count: number, indent = " ") {
  return string.replace(/^/gm, indent.repeat(count));
}
