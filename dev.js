var WebpackDevServer = require('webpack-dev-server')
var webpack = require('webpack')
var merge = require('webpack-merge')

module.exports = function (config, options) {
  config = merge(config, {
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })

  config.entry = [
    config.entry,
    require.resolve("webpack-dev-server/client") + "?http://localhost:" + options.port,
    require.resolve("webpack/hot/dev-server")
  ]

  var compiler = webpack(config)

  var devServerConfig = {
    contentBase: config.output.path,
    historyApiFallback: true,

    watchOptions: {
      aggregateTimeout: 300
    },

    quiet: options.quiet,
    stats: 'errors-only',
    hot: true
  }

  if (config.devServer) {
    devServerConfig = Object.assign(devServerConfig, config.devServer)
  }

  var server = new WebpackDevServer(compiler, devServerConfig)

  server.listen(options.port, '0.0.0.0', function () {
    console.log('webpack-dev-server http://0.0.0.0:%d/', options.port)
  })
}
