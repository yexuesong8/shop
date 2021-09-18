const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const plugins = require("../plugins.js");
const version = require("../package.json").version;
const config = require("./config");
const webpack = require("webpack");
const writePluginHash = require("./utils").writePluginHash;

function resolve(dir) {
  return path.join(__dirname, dir)
}

const hash = new Date().getTime();

const defaultWebpackConfig = {
  mode: 'production',
  output: {
    path: path.resolve(process.cwd(), `./lib/plugins/rabbit-v${version}`),
    publicPath: '/',
    filename: `js/[name].${hash}.js`,
    chunkFilename: '[id].js',
    library: `rabbit.[name]`,
    libraryTarget: 'umd',
    libraryExport: 'default',
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('../src'),
      '@assets': resolve('../src/assets/rabbit'),
    },
    modules: ['node_modules']
  },
  externals: config.pluginExternals,
  performance: {
    // 关闭超过文件指定大小时的提示
    hints: false,
  },
  stats: {
    children: false,
    chunks: false,
    modules: false,
  },
  module: {
    rules: [
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(),
        exclude: /node_modules|utils\/popper\.js|utils\/date\.js/,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.svg$/,
        include: resolve('../src/assets/rabbit/icons'),
        use: [
          {
            loader: "svg-sprite-loader",
            options: {
              symbolId: 'icon-[name]',
            },
          },
          'svgo-loader'
        ],
      },
      {
        test: /.(bpmn|xml)$/,
        loader: "raw-loader",
      },
      {
        test: /\.(svg|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        exclude: resolve('../src/assets/rabbit/icons'),
        query: {
          limit: 10000,
          name: path.posix.join('images', '[name].[ext]'),
          publicPath: "",
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('fonts', '[name].[ext]'),
          publicPath: "",
        }
      },
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserJSPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
      sourceMap: false,
      // extractComments: false, // LICENSE.txt文件
      }),
      new CssMinimizerPlugin(),
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new MiniCssExtractPlugin({
      filename: `css/[name].${hash}.css`,
    }),
    {
      apply: (compiler) => {
        compiler.hooks.done.tap('DonePlugin', ()=>{
          writePluginHash(hash);
        })
      }
    },
  ]
};

const buildWebpackConfig = () => {
  const configs = [];
  Object.keys(plugins).forEach(key => {
    const dir = key.includes(".") ? key.split(".")[0] : key;

    configs.push({
      ...defaultWebpackConfig,
      entry: {
        [key]: typeof (plugins[key]) === 'string' ? plugins[key] : plugins[key].src,
      },
      output: {
        ...defaultWebpackConfig.output,
        path: path.resolve(process.cwd(), `./lib/plugins/rabbit-v${version}/${dir}`),
      },
    });
  });

  return configs;
};

module.exports = buildWebpackConfig();
