const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const url = require("url");
 
// Create the native browser window.
function createWindow() { // Fonction pour créer la fenêtre principale
  const mainWindow = new BrowserWindow({
    icon: __dirname + '/appicon.png',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.maximize(); // Maximiser la fenêtre
  mainWindow.show(); // Afficher la fenêtre
  // Enlever la barre de menu
  mainWindow.menuBarVisible = false;

  const appURL = app.isPackaged // Si l'application est packagée
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000/";
  mainWindow.loadURL(appURL);
}
 
function setupLocalFilesNormalizerProxy() { // Fonction pour normaliser les fichiers locaux
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    },
  );
}
 
// Attendre que l'application soit prête avant de créer la fenêtre
app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
 
  app.on("activate", function () {
    // Sur macOS, recréer une fenêtre dans l'application lorsqu'il n'y a pas de fenêtres ouvertes.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});
 
// Quitter lorsque toutes les fenêtres sont fermées, sauf sur macOS.
// Il y a des applications spécifiques à macOS qui restent actives jusqu'à ce que l'utilisateur quitte explicitement.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
 

const allowedNavigationDestinations = "https://my-electron-app.com"; // Destination de navigation autorisée
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
 
    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});