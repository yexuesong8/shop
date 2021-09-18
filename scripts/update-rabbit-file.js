const shelljs = require("shelljs");
const chalk = require("chalk");

function getTime() {
  const localTime = new Date().toLocaleString();
  return localTime.replace(/\s/, "-").replace(/\:/g, "-");
}

function updateFolder({ from, to, name }) {
  console.log(chalk.blueBright(`${name}, 代码更新中...`));

  const backup = `${to}${getTime()}`;

  // 备份代码
  const shellString = shelljs.cp("-R", to, backup);

  // 备份没成功则直接退出
  if (shellString.code !== 0) process.exit(1);

  // 清空目录
  shelljs.rm('-rf', `${to}/*`);

  // 复制最新代码到目录
  const cpShellString = shelljs.cp("-R", `${from}/*`, to);

  if (cpShellString.code !== 0) {
    // 回退文件
    shelljs.cp("-R", `${backup}/*`, to);

    // 删除备份目录
    shelljs.rm('-rf', backup);

    console.log(chalk.whiteBright.bgRedBright(`${name}, 复制代码到目录失败，错误信息为: \n${cpShellString.stderr}`));
    return;
  }

  // 删除备份文件，手动删除
  // shelljs.rm("-rf", backup);

  console.log(chalk.blueBright(`${name}, 代码更新完成, 请手动删除备份文件.`));
}

function updateFile({ from, to, name, filename }) {
  console.log(chalk.blueBright(`${name}, 文件更新中...`));

  const filenameSplitArr = filename.split(".");
  const suffix = filenameSplitArr[1];
  const prefix = filenameSplitArr.reduce((accumulator, curValue, index) => {
    if (index !== filenameSplitArr.length - 1) return accumulator + curValue + ".";
    return accumulator + "";
  }, "");

  const backup = `${prefix}backup.${getTime()}.${suffix}`;

  // 备份文件
  const shellString = shelljs.cp(`${to}/${filename}`, backup);

  // 备份没成功则直接退出
  if (shellString.code !== 0) {
    console.log(chalk.whiteBright.bgRedBright(`${name}, 复制备份失败，错误信息为: \n${shellString.stderr}`));
    process.exit(1);
  }

  // 删除原文件
  shelljs.rm(`${to}/${filename}`);

  // 复制最新文件到目录
  const cpShellString = shelljs.cp("-R", `${from}/${filename}`, to);

  if (cpShellString.code !== 0) {
    // 回退文件
    shelljs.cp("-R", backup, `${to}/${filename}`);

    // 删除备份目录
    shelljs.rm(backup);

    console.log(chalk.whiteBright.bgRedBright(`${name}, 复制文件失败，错误信息为: \n${cpShellString.stderr}`));
    return;
  }

  // 删除备份文件, 手动删除
  // shelljs.rm(backup);

  console.log(chalk.blueBright(`${name}, 代码更新完成, 请手动删除备份文件.`));
}

const updateList = [
  {
    name: "mock",
    from: "node_modules/@rabbit.do/rabbit/mock",
    to: "mock",
    type: "folder",
  },
  {
    name: "assets",
    from: "node_modules/@rabbit.do/rabbit/src/assets/rabbit",
    to: "src/assets/rabbit",
    type: "folder",
  },
  {
    name: "loader",
    from: "node_modules/@rabbit.do/rabbit/scripts",
    to: "scripts",
    type: "file",
    filename: "loader.js"
  },
];

updateList.forEach(item => {
  if (item.type === "folder") updateFolder(item)
  if (item.type === 'file') updateFile(item)
});
