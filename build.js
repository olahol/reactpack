var webpack = require('webpack')
var ProgressPlugin = require('webpack/lib/ProgressPlugin')
var format = require('./format')

module.exports = function (config, options) {
  var compiler = webpack(config)

  compiler.apply(new ProgressPlugin(format.progress))

  compiler.run(function (err, stats) {
    if (err) {
      return format.done(err)
    }

    var jsonStats = stats.toJson()

    if (!options.quiet) {
      format.done(null, config, jsonStats.errors, jsonStats.warnings, jsonStats)
    }
  })
}
