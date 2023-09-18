const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "main.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);

  Menu.setApplicationMenu(mainMenu);

  ipcMain.on("key", (err, data) => {
    console.log(data);
  });
  ipcMain.on("key:inputValue", (err, data) => {
    console.log(data);
  });
  // new window
  ipcMain.on("key:newWindow", () => {
    createWindow();
  });
  mainWindow.on("close", () => {
    app.quit();
  });
});

const mainMenuTemplate = [
  {
    label: "Document",
    submenu: [
      {
        label: "Add new TODO",
        click: () => console.log("ok"),
      },
      {
        label: "Remove all",
      },
      {
        label: "Exit",
        accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
        role: "quit",
      },
    ],
  },
];

if (process.platform == "darwin") {
  mainMenuTemplate.unshift({
    label: app.getName(),
    role: "TODO",
  });
}

if (process.env.NODE_ENV !== "production") {
  mainMenuTemplate.push({
    label: "Dev Tools",
    submenu: [
      {
        label: "Open Dev Window",
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
      {
        label: "Reload",
        role: "reload",
      },
    ],
  });
}

function createWindow() {
  addWindow = new BrowserWindow({
    width: 482,
    height: 200,
    title: "New Window",
  });

  addWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "modal.html"),
      protocol: "file:",
      slashes: true,
    })
  );

  addWindow.on("close", () => {
    addWindow = null;
  });
}
