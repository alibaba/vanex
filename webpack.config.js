/* global __dirname, require, module*/
// vanex 的 umd 打包
// 暂时是为了类似 jsfiddle 等平台能够演示代码，不建议生产环境使用
// 会把除了 React 和 ReactDOM 外的依赖都直接打包进去，产生 lib/vanex.pack.min.js
// !!! 不建议在生产环境使用

const webpack = require('webpack');
const UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2

let libraryName = 'vanex';

let plugins = [], outputFile;

// if (env === 'build') {
plugins.push(new UglifyJsPlugin({ minimize: true }));
outputFile = libraryName + '.pack.min.js';
// } else {
//   outputFile = libraryName + '.pack.js';
// }

function firstUpperCase(str) {
  return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
}

const config = {
  entry: __dirname + '/src/index.js',
//   devtool: 'source-map',
  output: {
    path: __dirname + '/lib',
    filename: outputFile,
    library: firstUpperCase(libraryName),
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
    ]
  },
  resolve: {
    modules: [path.resolve('./node_modules'), path.resolve('./src')],
    extensions: ['.json', '.js']
  },
  plugins: plugins,
  externals: {
      react: {
          commonjs: 'react',
          commonjs2: 'react',
          amd: 'React',
          root: 'React',
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM',
      }
  },
};

module.exports = config;
