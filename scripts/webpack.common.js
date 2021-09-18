const path = require('path');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const config = require("./config");
const webpack = require('webpack');

function resolve(dir) {
  return path.join(__dirname, dir)
}

const webpackConfig = {
  mode: 'production',
  entry: {
    app: ['./src/entry/lib.js']
  },
  output: {
    path: path.resolve(process.cwd(), './lib'),
    publicPath: '/',
    filename: 'rabbit.min.js',
    chunkFilename: '[id].js',
    library: 'Rabbit',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('../src'),
      '@assets': resolve('../src/assets/rabbit'),
    },
    modules: ['node_modules']
  },
  externals: config.externals,
  performance: {
    hints: false
  },
  stats: {
    children: false
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
      }),
      new CssMinimizerPlugin(),
    ]
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
        }
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
          name: path.posix.join('static/img', '[name].[ext]'),
          publicPath: "",
        }
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static/fonts', '[name].[ext]'),
          publicPath: "",
        }
      },
    ]
  },
  plugins: [
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    // new BundleAnalyzerPlugin(),
  ]
};

module.exports = [
  webpackConfig,
  {
    ...webpackConfig,
    output: {
      ...webpackConfig.output,
      filename: 'rabbit.js',
    },
    optimization: {
      ...webpackConfig.optimization,
      minimize: false,
      minimizer: [],
    },
  }
];
