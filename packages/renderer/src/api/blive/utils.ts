export interface MedalColorSet {
  border: string;
  start?: string;
  end?: string;
}

export function medalColor(level: number): MedalColorSet {
  if (level >= 37) {
    return { border: "rgb(255, 232, 84)", start: "rgb(255, 97, 11)", end: "rgb(255, 208, 132)" };
  } else if (level >= 33) {
    return { border: "rgb(255, 232, 84)", start: "rgb(122, 4, 35)", end: "rgb(233, 134, 187)" };
  } else if (level >= 29) {
    return { border: "rgb(255, 232, 84)", start: "rgb(45, 8, 85)", end: "rgb(157, 155, 255)" };
  } else if (level >= 25) {
    return { border: "rgb(103, 232, 255)", start: "rgb(6, 21, 76)", end: "rgb(104, 136, 241)" };
  } else if (level >= 21) {
    return { border: "rgb(26, 84, 75)", start: "rgb(26, 84, 75)", end: "rgb(82, 157, 146)" };
  } else if (level >= 17) {
    return { border: "#c79d24" };
  } else if (level >= 13) {
    return { border: "rgb(190, 102, 134)" };
  } else if (level >= 9) {
    return { border: "rgb(141, 124, 166)" };
  } else if (level >= 5) {
    return { border: "rgb(93, 123, 158)" };
  } else {
    return { border: "rgb(92, 150, 142)" };
  }
}
