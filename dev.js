var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var merge = require('webpack-merge')

module.exports = function (config, options) {
  config = merge(config, {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })

  var compiler = webpack(config)

  var server = new WebpackDevServer(compiler, {
    contentBase: config.output.path,
    historyApiFallback: true,

    watchOptions: {
      aggregateTimeout: 300
    },

    quiet: options.quiet,
    stats: 'errors-only'
  })

  server.listen(options.port, '0.0.0.0', function () {
    console.log('webpack-dev-server http://localhost:%d/', options.port)
  })
}
