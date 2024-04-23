// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge } = require("electron");
 
// Here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});