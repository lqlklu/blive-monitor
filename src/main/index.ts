import { app, BrowserWindow } from "electron";
import { join } from "path";

const isDev = process.env.NODE_ENV === "development";
const url = isDev ? `http://localhost:3000` : "file://" + join(__dirname, "../../dist/renderer/index.html");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    titleBarStyle: "hidden",
    webPreferences: {
      // contextIsolation: false,
      // enableRemoteModule: false,
      // webSecurity: false,
      nodeIntegration: true,
      preload: join(__dirname, "preload.js"),
    },
  });
  if (isDev) {
    win.webContents.openDevTools();
  }
  win.loadURL(url);
};

app.on("ready", () => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
