var fs = require('fs')
var util = require('util')
var webpack = require('webpack')
var path = require('path')
var autoprefixer = require('autoprefixer')
var precss = require('precss')
var cssnano = require('cssnano')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackCleanupPlugin = require('webpack-cleanup-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var eslintrcUp = require('eslintrc-up')
var findUp = require('find-up')
var webpackMerge = require('webpack-merge')

module.exports = function (options) {
  options = options || {}

  var entry = options.entry
  var bundle = options.bundle || './dist/bundle.js'

  var bundleDir = path.dirname(bundle)
  var bundleBasename = path.basename(bundle)
  var bundleName = bundleBasename.split('.').slice(0, -1).join('.')

  var eslintConf = eslintrcUp.sync({cwd: process.cwd()})
  var babelRc = findUp.sync('.babelrc', {cwd: process.cwd()})
  var webpackConfig = findUp.sync('webpack.config.js', {cwd: process.cwd()})

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

  if (options.dev || options.absolutePath) {
    config.output.publicPath = '/'
  }

  config._msgs = []

  var preLoaders = []
  var loaders = []

  if (options.lint) {
    if (eslintConf && !options.standard) {
      config._msgs.push(util.format(
        'Using user eslint config for linting (%s).',
        path.relative(process.cwd(), eslintConf)
      ))

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

  var babelLoaderQuery = {
    presets: [
      'babel-preset-es2015',
      'babel-preset-react',
      'babel-preset-stage-0'
    ].map(require.resolve)
  }

  if (babelRc) {
    try {
      var babelRcData = fs.readFileSync(babelRc, 'utf8')
      var babelRcQuery = JSON.parse(babelRcData)
      config._msgs.push(util.format(
        'Using babel config (%s)',
        path.relative(process.cwd(), babelRc)
      ))
      babelLoaderQuery = webpackMerge(babelLoaderQuery, babelRcQuery)
    } catch (e) {
      config._msgs.push(util.format(
        'Error loading babel config (%s): %s',
        path.relative(process.cwd(), babelRc),
        e.message
      ))
    }
  }

  loaders.push({
    test: /\.jsx?$/,
    exclude: /(node_modules|bower_components)/,
    loader: 'babel',
    query: babelLoaderQuery
  })

  loaders.push({
    test: /\.json/,
    loader: 'json'
  })

  if (options.extract) {
    loaders.push({
      test: /\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'postcss-loader')
    })
  } else {
    loaders.push({
      test: /\.css$/,
      loader: 'style!css!postcss'
    })
  }

  loaders.push({
    test: /\.(jpg|png|gif)$/,
    loader: 'url?limit=10000'
  })

  loaders.push({
    test: /\.(eot|woff|woff2|ttf|svg)$/,
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

  if (options.env) {
    var envfile = path.join(process.cwd(), path.dirname(entry), '.env.js')

    try {
      var environments = require(envfile)
      config.plugins.push(new webpack.DefinePlugin(environments))

      config._msgs.push(util.format(
        'Using custom environments (%s).',
        path.relative(process.cwd(), JSON.stringify(environments))
      ))
      config._msgs.push(util.format(
        'Using custom environments found in root of entrypoint (%s).',
        path.relative(process.cwd(), envfile)
      ))
    } catch (e) {
    }
  }

  config.module.preLoaders = preLoaders
  config.module.loaders = loaders

  if (options.optimize) {
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {warnings: false}
    }))
    config.plugins.push(new webpack.optimize.DedupePlugin())
    config.plugins.push(new webpack.DefinePlugin({
      'process.env': {'NODE_ENV': JSON.stringify('production')}
    }))
  }

  if (options.clean) {
    config.plugins.push(new WebpackCleanupPlugin())
  }

  if (options.extract) {
    config.plugins.push(new ExtractTextPlugin(bundleName + '.css'))
  }

  if (options.html) {
    var template = path.join(process.cwd(), path.dirname(entry), 'index.ejs')

    try {
      fs.accessSync(template)
      config._msgs.push(util.format(
        'Using custom template found in root of entrypoint (%s).',
        path.relative(process.cwd(), template)
      ))
    } catch (e) {
      template = path.join(__dirname, 'index.ejs')
    }

    config.plugins.push(new HtmlWebpackPlugin({
      title: 'Reactpack App',
      dev: options.dev,
      port: options.port,
      template: template,
      inject: options.inject
    }))
  }

  if (webpackConfig) {
    try {
      var webpackConfigData = require(webpackConfig)
      config = webpackMerge.smart(config, webpackConfigData)
      config._msgs.push(util.format(
        'Merging found webpack config %s with reactpack config.',
        path.relative(process.cwd(), webpackConfig)
      ))
    } catch (err) {
      throw err
    }
  }

  return config
}
