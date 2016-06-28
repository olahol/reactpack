# 2016-06-28 (0.7.3)

* Switch dev server from localhost to 0.0.0.0.

# 2016-06-20 (0.7.0)

* Load `webpack.config.js` if one is found and merge with reactpack config.

# 2016-06-20 (0.6.0)

* Load .babelrc if one is found and merge with reactpack babel settings.
* Use absolute path with dev server.
* Add option to not inject bundles `--no-inject`.
* Add option to inject bundles with absolute path `--absolute-path`.

# 2016-06-13 (0.5.1)

* Force `process.env.NODE_ENV` to equal `production` when optimizing.
* Suppress errors from UglifyJS.

# 2016-06-13 (0.5.0)

* Add option for custom environments (.env.js) using DefinePlugin.

# 2016-06-11 (0.4.5)

* Fix parsing of port option.

# 2016-06-10 (0.4.4)

* Add gif and jpg to url-loader.

# 2016-06-04 (0.4.2)

* Add flag to turn off css extraction.

# 2016-06-04 (0.4.0)

* Add ability to have custom `index.ejs`.
