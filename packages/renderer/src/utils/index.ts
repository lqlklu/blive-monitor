export function range(len: number, start?: number): number[] {
  let a = [...Array(len).keys()];
  if (start === undefined) {
    return a;
  }
  return a.map((i) => i + start);
}
