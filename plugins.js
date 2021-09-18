const path = require("path");

let plugins = {};

require('require-all')({
  dirname: path.resolve(process.cwd(), './src/plugin/provide'),
  filter: /(entry)\.js/,
  resolve: function(plugin) {
    plugins = {
      ...plugins,
      ...plugin,
    };
  },
});

module.exports = plugins;
