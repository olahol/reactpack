var path = require('path')
var filesize = require('filesize')
var ProgressBar = require('./bar')
require('colour')

function countEmittedAssets (assets) {
  return assets.filter(function (asset) { return asset.emitted }).length
}

function singlespace () {
  console.log()
}

function doublespace () {
  console.log('\n')
}

function indentLine (n, line) {
  return Array(n).join(' ') + line
}

function indentLines (n, lines) {
  return lines.split('\n').map(function (line) {
    return indentLine(n, line)
  }).join('\n')
}

function formatMsgs (msgs) {
  if (msgs.length > 0) {
    console.error(indentLine(2, 'Messages:'.bold.blue))

    msgs.forEach(function (msg, i) {
      console.log(indentLines(4, msg))
    })

    doublespace()
  }
}

function formatErrors (errors) {
  if (errors.length > 0) {
    console.error(indentLine(2, 'Errors:'.bold.red))

    errors.forEach(function (error, i) {
      console.error(indentLines(4, error))
      if (i !== errors.length - 1) { singlespace() }
    })

    doublespace()
  }
}

function formatWarnings (warnings) {
  if (warnings.length > 0) {
    console.log(indentLine(2, 'Warnings:'.bold.yellow))

    warnings.forEach(function (warning, i) {
      console.log(indentLines(4, warning))
      if (i !== warnings.length - 1) { singlespace() }
    })

    doublespace()
  }
}

function formatStats (config, stats) {
  if (countEmittedAssets(stats.assets) > 0) {
    console.log(indentLine(2, 'Files:'.bold.green))

    stats.assets.forEach(function (asset) {
      var pathToAsset = path.relative(process.cwd(), path.join(config.output.path, asset.name))
      var sizeOfAsset = filesize(asset.size)
      if (asset.emitted) {
        console.log(indentLines(4, pathToAsset + ' (' + sizeOfAsset + ')'))
      }
    })

    doublespace()
  }
}

exports.pre = function (config) {
  if (config._msgs.length > 0) {
    doublespace()
  }

  formatMsgs(config._msgs)
}

exports.done = function (err, config, errors, warnings, stats) {
  if (err) {
    return console.error(err)
  }

  if ((errors.length > 0 || warnings.length > 0 || countEmittedAssets(stats.assets) > 0) && config._msgs.length === 0) {
    doublespace()
  }

  formatErrors(errors)
  formatWarnings(warnings)
  formatStats(config, stats)
}

var bar = new ProgressBar()
exports.progress = function (percent, msg) {
  if (percent === 1) {
    bar.hide()
  } else {
    bar.show(msg, percent)
  }
}
