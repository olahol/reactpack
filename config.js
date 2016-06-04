var webpack = require('webpack')
var path = require('path')
var autoprefixer = require('autoprefixer')
var precss = require('precss')
var cssnano = require('cssnano')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var eslintrcUp = require('eslintrc-up')

module.exports = function (options) {
  options = options || {}

  var entry = options.entry
  var bundle = options.bundle || './dist/bundle.js'

  var bundleDir = path.dirname(bundle)
  var bundleBasename = path.basename(bundle)
  var bundleName = bundleBasename.split('.').slice(0, -1).join('.')

  var eslintConf = eslintrcUp.sync({cwd: process.cwd()})

  var config = {
    entry: entry,
    resolveLoader: {
      root: path.join(__dirname, 'node_modules')
    },
    output: {
      path: path.resolve(bundleDir),
      filename: bundleBasename
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
    if (eslintConf && !options.standard) {
      preLoaders.push({
        test: /\.jsx?$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|bower_components)/
      })

      config.eslint = {
        configFile: eslintConf
      }
    } else {
      preLoaders.push({
        test: /\.jsx?$/,
        loader: 'standard',
        exclude: /(node_modules|bower_components)/
      })

      config.standard = {
        parser: 'babel-eslint'
      }
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
    loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
  })

  loaders.push({
    test: /\.(png)$/,
    loader: 'url?limit=100000'
  })

  loaders.push({
    test: /\.(jpg|eot|woff|woff2|ttf|svg)$/,
    loader: 'file'
  })

  if (options.postcss) {
    if (config.optimize) {
      config.postcss = function () {
        return [precss, autoprefixer, cssnano]
      }
    } else {
      config.postcss = function () {
        return [precss, autoprefixer]
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
    config.plugins.push(new WebpackCleanupPlugin())
  }

  config.plugins.push(new ExtractTextPlugin(bundleName + '.css'))

  if (options.html) {
    var template = path.dirname(entry) + "/index.ejs"

    try {
      fs.accessSync(template)
      console.log("Using custom template found in root of entrypoint.")
    } catch(e) {
      console.log("No custom template found, falling back to default :)", e)
      template = path.join(__dirname, 'index.ejs')
    }
    config.plugins.push(new HtmlWebpackPlugin({
      title: 'Reactpack App',
      dev: options.dev,
      port: options.port,
      template: template
    }))
  }
  
  return config
}
