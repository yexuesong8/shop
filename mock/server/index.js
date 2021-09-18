
const chokidar = require('chokidar');
const chalk = require('chalk');
const path = require("path");
const glob = require('glob');
const mockDataDir = path.join(process.cwd(), 'mock/data');

const routes = new Map();

function cleanRequireCache() {
  Object.keys(require.cache).forEach(i => {
    if (i.includes(mockDataDir)) {
      delete require.cache[require.resolve(i)];
    }
  });
}

function getRoutes() {
  const routesDir = path.resolve("./mock/data");
  const files = glob.sync(`${routesDir.replace(/\\/g, '/')}/**/*.js`);
  let routes = [];
  files.forEach(file => {
    const route = require(file);
    if (Array.isArray(route)) {
      routes = routes.concat(route);
    } else if (typeof route === 'object') {
      routes.push(route);
    }
  });
  return routes;
}

function registerRoutes() {
  const mockRoutes = getRoutes();
  mockRoutes.forEach(route => {
    routes.set(`/mock${route.path}`, route.result);
  });
}

function getResult(path) {
  return routes.get(path) || { statusCode: 600, data: null, message: "未找到相关result" };
}

function mockServer(app) {
  registerRoutes();

  app.all("/mock/api/*", function(req, res, next) {
    const result = getResult(req.path);
    console.log(chalk.yellowBright(`mock request invoke: ${req.path}`));
    res.json(result);
  });

  chokidar.watch(mockDataDir, {
    ignoreInitial: true,
  }).on("all", (event, path) => {
    if (event === "change" || event === "add") {
      try {
        cleanRequireCache();

        registerRoutes();
  
        console.log(chalk.magentaBright(`\n > Mock Server hot reload success! changed  ${path}`));
      } catch(error) {
        console.log(chalk.redBright(error))
      }
    }
  });
}

module.exports = mockServer;
