'use strict';
require('babel-polyfill');
const path = require('path');
const proxy = require("./proxy");
const config = require("./scripts/config");
const webpack = require("webpack");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const port = process.env.port || process.env.npm_config_port || 80; // 端口
const packageName = require('./package.json').name;
const isPluginMode = process.env.RUN_ENV === 'plugin';
const externals = isPluginMode ? config.pluginExternals : {};

// vue.config.js 配置说明  参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions 具体配置参考文档
module.exports = {
  // 部署目录
  publicPath: "/",
  // 打包输出地址
  outputDir: 'dist',
  // 静态资源目录
  assetsDir: 'static',
  // 是否开启eslint保存检测，有效值：true | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development' ? 'error' : false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  runtimeCompiler: true,
  devServer: {
    host: '0.0.0.0',
    port,
    proxy,
    disableHostCheck: true,
    overlay: {
      warnings: false,
      errors: true,
    },
    before: require("./mock/server/index"),
  },
  configureWebpack: {
    name: "Rabbit Framework",
    entry: isPluginMode ? [ "./src/entry/main.js", ] : [ "babel-polyfill", "./src/entry/main.js" ],
    resolve: {
      alias: {
        '@': resolve('src'),
        '@assets': resolve('src/assets/rabbit'),
        "Rabbit": resolve("src"),
        "@node_modules": resolve("node_modules"),
      },
    },
    output: {
      library: `${packageName}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${packageName}`,
    },
    externals,
    plugins: [
      // 指定打包环境
      new webpack.EnvironmentPlugin({
        RUN_ENV: process.env.RUN_ENV,
      }),
    ],
  },
  chainWebpack(config) {
    config.plugins.delete('preload'); // TODO: need test
    config.plugins.delete('prefetch'); // TODO: need test
    
    // set svg-sprite-loader
    config.module
      .rule('svg')
      .exclude.add(resolve('src/assets/rabbit/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/rabbit/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end();
    const oneOfsMap = config.module.rule('scss').oneOfs.store;
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          // Or array of paths
          resources: [
            path.resolve(__dirname, 'src/assets/rabbit/styles/theme.scss'), 
            path.resolve(__dirname, 'src/assets/rabbit/styles/theme-mixin.scss'), 
          ]
        })
        .end()
    });
    // if (process.env.RUN_ENV === 'plugin') {
    //   config.module
    //     .rule("images")
    //     .test(/\.(svg|gif|png|jpe?g)(\?\S*)?$/)
    //     .exclude.add(resolve('./src/assets/rabbit/icons'))
    //     .end()
    //     .use("url-loader")
    //     .loader("url-loader")
    //     .options({
    //       limit: 10000,
    //       name: path.posix.join('core/rabbit/img', '[name].[ext]'),
    //       publicPath: "",
    //       esModule: false,
    //     })
    //     .end();
    // }

    // set preserveWhitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();

    // bpmn文件
    config.module
      .rule('raw-loader')
      .test(/.(bpmn|xml)$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end();

    config
      // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      );

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
            // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/,
            }])
            .end();
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial', // only package third parties that are initially dependent
                },
                element: {
                  name: "chunk-element",
                  priority: 20,
                  test: /[\\/]node_modules[\\/]@monkey.do[\\/]element-ui(.*)/,
                },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true,
                },
              },
            });
          config.optimization.runtimeChunk('single');
        }
      );
  },
};
