const webpack = require('atool-build/lib/webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin');
const StringReplacePlugin = require("string-replace-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path")

module.exports = function (webpackConfig, env) {
  webpackConfig.babel.plugins.push('transform-runtime')
  webpackConfig.babel.plugins.push(['import', {
    libraryName: 'antd',
    style: true
  }])

  // Support hmr
  if (env === 'development') {
    webpackConfig.devtool = 'source-map'
    webpackConfig.babel.plugins.push(['dva-hmr', {
      entries: [
        './src/index.js'
      ]
    }])
  } else {
    webpackConfig.babel.plugins.push('dev-expression')
  }
  // webpackConfig.output = {
  //    publicPath: '/arbiter/new'
  // }

  //
  webpackConfig.plugins.push(
    new CopyWebpackPlugin([
      {
        from: __dirname + '/iconfont/**',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/apidocs_en.html',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/apidocs_zh.html',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/polyfill-ie10.js',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/polyfill-ie11.js',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/guideTip.png',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/guideTip_en.png',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/Critical.wav',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/Information.wav',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/Recovery.wav',
        to: __dirname + '/dist/'
      },
      {
        from: __dirname + '/Warning.wav',
        to: __dirname + '/dist/'
      },
    ]),
    new HtmlWebpackPlugin({
      title: 'Alert',
      filename: './dist/rest.html',
      template: './src/template/rest.html',
      inject: true,
      chunks: []
    }),
    new HtmlWebpackPlugin({
      title: 'Alert',
      filename: './dist/index.html',
      template: './src/template/index.html',
      inject: true,
      chunks: []
    })
   );

  // Don't extract common.js and common.css
  webpackConfig.plugins = webpackConfig.plugins.filter(function (plugin) {
    return !(plugin instanceof webpack.optimize.CommonsChunkPlugin)
  })

  // Support CSS Modules
  // Parse all less files as css module.
  webpackConfig.module.loaders.forEach(function (loader, index) {
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.less$') > -1) {
      loader.include = /node_modules/
      loader.test = /\.less$/
    }
    if (loader.test.toString() === '/\\.module\\.less$/') {
      loader.exclude = /node_modules/
      loader.test = /\.less$/
    }
    if (typeof loader.test === 'function' && loader.test.toString().indexOf('\\.css$') > -1) {
      loader.include = /node_modules/
      loader.test = /\.css$/
    }
    if (loader.test.toString() === '/\\.module\\.css$/') {
      loader.exclude = /node_modules/
      loader.test = /\.css$/
    }
  })




  return webpackConfig
}
