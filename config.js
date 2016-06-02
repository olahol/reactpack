var webpack = require('webpack')
var path = require('path')
var autoprefixer = require('autoprefixer')
var cssnano = require('cssnano')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')

module.exports = function (options) {
  options = options || {}

  var entry = options.entry
  var bundle = options.bundle || './dist/bundle.js'

  var config = {
    entry: entry,
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    output: {
      path: path.resolve(path.dirname(bundle)),
      filename: path.basename(bundle)
    },
    module: {},
    plugins: []
  }

  if (options.sourceMap) {
    config.devtool = 'source-map'
  }

  var preLoaders = []
  var loaders = []

  if (options.lint) {
    preLoaders.push({
      test: /\.jsx?$/,
      loader: 'standard',
      exclude: /(node_modules|bower_components)/
    })

    config.standard = {
      parser: 'babel-eslint'
    }
  }

  loaders.push({
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: {
      presets: [
        'babel-preset-es2015',
        'babel-preset-react',
        'babel-preset-stage-0'
      ].map(require.resolve)
    }
  })

  loaders.push({
    test: /\.json/,
    loader: 'json'
  })

  loaders.push({
    test: /\.css$/,
    loader: 'style!css!postcss'
  })

  loaders.push({
    test: /\.(png)$/,
    loader: 'url?limit=100000'
  })

  loaders.push({
    test: /\.(jpg|eot|woff|woff2|ttf|svg)$/,
    loader: 'file'
  })

  loaders.push({
    test: /\.less$/,
    loader: 'style!postcss!less'
  })

  loaders.push({
    test: /\.sass/,
    loader: 'style!postcss!sass'
  })

  if (options.postcss) {
    if (config.optimize) {
      config.postcss = function () {
        return [autoprefixer, cssnano]
      }
    } else {
      config.postcss = function () {
        return [autoprefixer]
      }
    }
  }

  config.module.preLoaders = preLoaders
  config.module.loaders = loaders

  if (options.optimize) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}))
    config.plugins.push(new webpack.optimize.DedupePlugin())
  }

  if (options.clean) {
    config.plugins(new WebpackCleanupPlugin())
  }

  if (options.html) {
    config.plugins.push(new HtmlWebpackPlugin({
      title: 'Reacpack App',
      dev: options.dev,
      port: options.port,
      template: path.join(__dirname, 'index.ejs')
    }))
  }

  return config
}
