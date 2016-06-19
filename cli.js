#!/usr/bin/env node

var pkg = require('./package.json')
var program = require('commander')
var format = require('./format')

program
  .version(pkg.version)
  .option('-q, --quiet', 'no output')
  .option('-O, --optimize', 'optimize css and js using minifiers')
  .option('-w, --watch', 'watch mode, rebuild bundle on file changes')
  .option('-d, --dev', 'start a dev server with hot module replacement')
  .option('-p, --port <port>', 'port for dev server (default is 8000)', parseInt)
  .option('--standard', 'force standard linting (do not look for eslint config)')
  .option('--clean', 'delete everything in bundle path before building')
  .option('--absolute-path', 'use absolute path for assets')
  .option('--no-source-map', 'don\'t output source maps for css and js')
  .option('--no-postcss', 'don\'t use postcss (autoprefixer and precss)')
  .option('--no-html', 'don\'t output an index.html')
  .option('--no-extract', 'don\'t extract css into separate bundle')
  .option('--no-lint', 'turn off linting')
  .option('--no-env', 'don\'t try and load .env.js file')
  .option('--no-inject', 'don\'t inject bundles into index.html')
  .arguments('<entry> [path/to/bundle]')

program.parse(process.argv)

var config = require('./config')
var build = require('./build')
var watch = require('./watch')
var dev = require('./dev')

function isJSFile (file) {
  return /\.jsx?$/.test(file)
}

var entry = program.args[0]

if (entry && (entry[0] !== '.' || entry[0] !== '/')) {
  entry = './' + entry
}

if (!entry) {
  console.log('reactpack [options] <entry> [path/to/bundle]')
  process.exit(1)
}

if (!isJSFile(entry)) {
  entry += '/index.js'
}

var bundle = program.args[1]

if (bundle && !isJSFile(bundle)) {
  bundle += '/bundle.js'
}

var port = program.port || 8000

var webpackConfig = config({
  entry: entry,
  bundle: bundle,
  sourceMap: program.sourceMap,
  optimize: program.optimize,
  lint: program.lint,
  dev: program.dev,
  port: port,
  html: program.html,
  clean: program.clean,
  standard: program.standard,
  extract: program.extract,
  env: program.env,
  inject: program.inject,
  absolutePath: program.absolutePath
})

if (!program.quiet) {
  format.pre(webpackConfig)
}

if (program.dev) {
  dev(webpackConfig, {
    quiet: program.quiet,
    port: port
  })
} else if (program.watch) {
  watch(webpackConfig, {
    quiet: program.quiet
  })
} else {
  build(webpackConfig, {
    quiet: program.quiet
  })
}
