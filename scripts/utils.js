const fs = require("fs")
const path = require("path")
const plugins = require("../src/plugin/inject/plugins.json");
const package = require("../package.json")


const isSelfModule = (moduleName) => package.name.includes(moduleName)

const writePluginHash = function(hash) {
  fs.writeFileSync(path.resolve(__dirname, "../lib/plugin-hash.txt"), String(hash));
}

const readPluginVersion = function(moduleName) {
  const isSelfModule = package.name.includes(moduleName);
  const nodeModulesName = `@${moduleName}.do/${moduleName}`;

  let version = "";

  if (isSelfModule) {
    version = package.version
  } else {
    version = require(`../node_modules/${nodeModulesName}/package.json`).version
  }
  return version;
};

const readPluginHash = function(module) {
  if (isSelfModule(module)) {
    return fs.readFileSync(path.resolve(__dirname, `../lib/plugin-hash.txt`), "utf-8")
  }
  return fs.readFileSync(path.resolve(__dirname, `../node_modules/@${module}.do/${module}/lib/plugin-hash.txt`), "utf-8")
}

const replaceLoaderHash = function(string) {
  const loaderString = fs.readFileSync(path.resolve(__dirname, `./loader-template.js`), "utf-8")
  const newString = loaderString.replace(/("<<[A-Za-z0-9]*>>")/, string)
  fs.writeFileSync(path.resolve(__dirname, "./loader.js"), newString)
}

const writePluginJs = () => {
  const pluginStringArr = [];

  let hashString = ``;
  let versionString = ``;

  plugins.forEach(pluginString => {
    const [moduleName, pluginName] = pluginString.split(".")

    let version = readPluginVersion(moduleName);
    let hash = readPluginHash(moduleName)

    pluginStringArr.push(`"${pluginString}|v${version}|${hash}"`)

    if (!hashString.includes(moduleName)) hashString += `${moduleName}: ${hash},`
    if (!versionString.includes(moduleName)) versionString += `${moduleName}: '${version}',`
  })

  const fileContentString = `window.injectPlugins = [${pluginStringArr.join(",")}];\nwindow.pluginVersion={ ${versionString} };\nwindow.pluginHash = { ${hashString} };`

  fs.writeFileSync(path.join(__dirname, "../src/plugin/inject/plugins.js"), fileContentString)
};

const writeLoaderJs = () => {
  const moduleArr = [];
  plugins.forEach(pluginString => {
    const [moduleName] = pluginString.split(".")
    if (!moduleArr.includes(moduleName)) {
      moduleArr.push(moduleName)
    }
  });

  let hashString = ``;
  moduleArr.forEach(moduleName => {
    const hash = readPluginHash(moduleName)
    hashString += `${moduleName}:${hash},`
  })

  replaceLoaderHash(`{${hashString}}`)
};

const genNodeModuleName = (moduleName) => `@${moduleName}.do/${moduleName}`;
exports.genNodeModuleName = genNodeModuleName;

const getPluginNodeModulePath = (plugString) => {
  const [moduleName, pluginName] = plugString.split(".");
  const version = readPluginVersion(moduleName);

  return path.resolve(__dirname, `../node_modules/${genNodeModuleName(moduleName)}/lib/plugins/${moduleName}-v${version}/${pluginName}`);
};
exports.getPluginNodeModulePath = getPluginNodeModulePath;

const pluginHasStyle = (plugString) => {
  const [moduleName, pluginName] = plugString.split(".");
  const hash = readPluginHash(moduleName);
  const pluginPath = getPluginNodeModulePath(plugString);

  let hasStyle = true;
  try {
    fs.readFileSync(`${pluginPath}/css/${pluginName}.${hash}.css`, "utf-8");
  } catch(err) {
    hasStyle = false;
  }

  return hasStyle;
};

exports.pluginHasStyle = pluginHasStyle;

exports.isSelfModule = isSelfModule;
exports.readPluginHash = readPluginHash;
exports.readPluginVersion = readPluginVersion;
exports.writePluginJs = writePluginJs;
exports.writePluginHash = writePluginHash;
exports.replaceLoaderHash = replaceLoaderHash;
exports.writeLoaderJs = writeLoaderJs;
