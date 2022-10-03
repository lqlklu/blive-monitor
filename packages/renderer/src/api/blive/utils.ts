export function medalColor(level: number): string {
  if (level >= 21) {
    return "rgb(26, 84, 75)";
  } else if (level >= 17) {
    return "#c79d24";
  } else if (level >= 13) {
    return "rgb(190, 102, 134)";
  } else if (level >= 9) {
    return "rgb(141, 124, 166)";
  } else if (level >= 5) {
    return "rgb(93, 123, 158)";
  } else {
    return "rgb(92, 150, 142)";
  }
}
