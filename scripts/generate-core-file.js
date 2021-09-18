const path = require("path");
const shelljs = require("shelljs");
const chalk = require("chalk");
const { writePluginJs } = require("./utils");

function resolve(dir) {
  return path.join(__dirname, dir)
}

const coreLibs = {
  "vue": {
    fileSrc: "../node_modules/vue/dist",
    fileName: "vue.min.js",
  },
  "vuex": {
    fileSrc: "../node_modules/vuex/dist",
    fileName: "vuex.min.js",
  },
  "vue-router": {
    fileSrc: "../node_modules/vue-router/dist",
    fileName: "vue-router.min.js",
  },
  "element-ui/js": {
    fileSrc: "../node_modules/@monkey.do/element-ui/lib",
    fileName: "index.js",
  },
  "element-ui/css": {
    fileSrc: "../node_modules/@monkey.do/element-ui/lib/theme-chalk",
    fileName: "index.css",
  },
  // 由于element-ui css的fonts路径问题
  // 要将fonts文件复制到element-ui css文件下
  "element-ui/css/fonts": {
    fileSrc: "../node_modules/@monkey.do/element-ui/lib/theme-chalk/fonts",
    fileName: ["element-icons.ttf", "element-icons.woff"],
  },
  "monkey/js": {
    fileSrc: "../node_modules/@monkey.do/monkey/lib",
    fileName: "monkey.min.js",
  },
  "monkey/css": {
    fileSrc: "../node_modules/@monkey.do/monkey/lib/theme-chalk",
    fileName: "index.css",
  },
  "monkey/img": {
    fileSrc: "../node_modules/@monkey.do/monkey/lib/img",
    fileName: "*",
  },
  "rabbit/js": {
    fileSrc: "../lib",
    fileName: "rabbit.plugin.js",
  },
  "rabbit/css": {
    fileSrc: "../lib",
    fileName: "style.plugin.css",
  },
  "rabbit/img": {
    fileSrc: "../lib/core/rabbit/img",
    fileName: "*",
  },
  "rabbit/fonts": {
    fileSrc: "../lib/core/rabbit/fonts",
    fileName: "*",
  },
};

Object.keys(coreLibs).forEach(key => {
  const coreLib = coreLibs[key];
  if (coreLib.fileSrc) {
    const dir = resolve(`../dist/core/${key}/`);
    shelljs.mkdir('-p', dir);

    const copyFile = (src, fileName, key) => {
      let shellString = "";
      if (fileName === "*") {
        shellString = shelljs.cp("-Rf", resolve(`${coreLib.fileSrc}/*`), dir);
      } else {
        shellString = shelljs.cp("-Rf", resolve(`${coreLib.fileSrc}/${fileName}`), dir);
      }

      if (shellString.code !== 0) {
        console.log(chalk.whiteBright.bgRedBright(`复制${key}文件失败`));
      } else {
        console.log(chalk.blueBright(`复制${key}文件成功`));
      }
    };

    if (Array.isArray(coreLib.fileName)) {
      coreLib.fileName.forEach(fileName => {
        copyFile(coreLib.fileSrc, fileName, `${key}/${fileName}`);
      });
    } else {
      copyFile(coreLib.fileSrc, coreLib.fileName, key);
    }
  }
});

// 复制plugins文件
const pluginDir = resolve(`../dist/plugins/`);
shelljs.mkdir('-p', pluginDir);
const shellString = shelljs.cp("-Rf", resolve(`../lib/plugins/*`), pluginDir);
if (shellString.code !== 0) {
  console.log(chalk.whiteBright.bgRedBright(`复制plugins失败`));
} else {
  console.log(chalk.blueBright(`复制plugins文件成功`));
}

// 生成plugin.js
writePluginJs();
