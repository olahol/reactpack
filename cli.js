#!/usr/bin/env node

var pkg = require('./package.json')
var program = require('commander')

program
  .version(pkg.version)
  .option('-q, --quiet', 'no output')
  .option('-O, --optimize', 'optimize')
  .option('-w, --watch', 'watch')
  .option('-d, --dev', 'dev')
  .option('-p, --port', 'port for webpack-dev-server')
  .option('--clean', 'clean everything in bundle path before building')
  .option('--no-source-map', 'output source map')
  .option('--no-postcss', 'do not use postcss')
  .option('--no-html', 'do not output an index.html')
  .option('--no-lint', 'turn off linting')
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
  clean: program.clean
})

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
