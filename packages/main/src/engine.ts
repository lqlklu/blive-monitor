import { execFile, spawn } from "child_process";
import { join, resolve } from "path";
import { app } from "electron";

export function start() {
  const base = resolve(app.getAppPath(), "..");
  const path = join(base, "engine/blive-proxy");
  const instance = execFile(path, [], {}, (error, stdout, stderr) => {
    if (error) {
      console.log(error);
    }
    console.log(stdout);
    console.log(stderr);
  });
  // const instance = spawn(path, {
  //   windowsHide: false,
  //   stdio: "pipe",
  // });
}

export default {
  start,
};
