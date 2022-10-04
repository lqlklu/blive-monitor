import { ChildProcess, execFile } from "child_process";
import { join, resolve } from "path";
import { app } from "electron";

export class Engine {
  private inst: ChildProcess | undefined;

  private get path() {
    const base = resolve(app.getAppPath(), "..");
    return join(base, "engine/blive-proxy");
  }

  start() {
    this.inst = execFile(this.path, [], {}, (error, stdout, stderr) => {
      if (error) {
        console.log(error);
      }
      console.log(stdout);
      console.log(stderr);
    });
  }
  stop() {
    this.inst?.kill();
  }
}
