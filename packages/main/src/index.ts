import { app, BrowserWindow } from "electron";

import engine from "./engine";

app.whenReady().then(() => {
  engine.start();

  const win = new BrowserWindow({
    useContentSize: true,
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (app.isPackaged) {
    win.loadFile("dist/renderer/index.html");
    win.webContents.openDevTools();
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL as string);
    win.webContents.openDevTools();
  }
});
