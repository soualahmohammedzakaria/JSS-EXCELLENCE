// Tous les scripts de préchargement sont exécutés dans un environnement isolé,
//ce qui signifie qu'ils ne partagent pas le même contexte que la page web.
const { contextBridge } = require("electron");
 
// Ici on expose les versions de Node.js et Chromium à la page web
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("versions", process.versions);
});