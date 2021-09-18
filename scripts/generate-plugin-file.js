const shelljs = require("shelljs");
const chalk = require("chalk");
const path = require("path");
const { readPluginVersion, isSelfModule } = require("./utils");

const injectPlugins = require("../src/plugin/inject/plugins.json");

function updateFolder(plugin) {
  const name = plugin.project.split("/")[1];
  console.log(chalk.blueBright(`${name}, 复制插件中...`));

  const folderName = `${name}-${plugin.version}`;
  const from = path.resolve(__dirname, `../node_modules/${plugin.project}/lib/plugins/${folderName}`);
  const to =  path.resolve(__dirname, `../dist/plugins/${folderName}`);

  // 先建立目录
  shelljs.mkdir(to);

  // 复制最新代码到目录
  const cpShellString = shelljs.cp("-R", `${from}/*`, to);

  if (cpShellString.code !== 0) {
    console.log(chalk.whiteBright.bgRedBright(`${name}, 复制代码到目录失败，错误信息为: \n${cpShellString.stderr}`));
    return;
  }

  console.log(chalk.blueBright(`${name}, 插件复制完成.`));
}

const copiedPlugin = new Set();

injectPlugins.forEach(pluginString => {
  const [moduleName] = pluginString.split(".");

  if (isSelfModule(moduleName)) return;
  if (copiedPlugin.has(moduleName)) return;

  updateFolder({
    project: `@${moduleName}.do/${moduleName}`,
    version: `v${readPluginVersion(moduleName)}`,
  });

  copiedPlugin.add(moduleName);
});
