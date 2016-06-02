# reactpack [![js-standard-style][standard-image]][standard-url]

> one `npm i` to build your react app.

<p align="center">
  <img src="reactpack.png" alt="reactpack"/>
</p>

- [x] One package, no more hunting around for what loaders or babel presets you need.
- [x] Linting with `standard`.
- [x] ES6 with Babel presets `react`, `es2015` and `stage-0`.
- [x] Style loaders  (`css`, `less`, `sass`)
- [x] PostCSS with `autoprefixer`.
- [x] Full source maps.
- [x] Watch mode (`--watch`).
- [x] Development server mode (`--dev`).
- [x] Automatic index.html creation with `html-webpack-plugin`.
- [x] Toggable optimiziation with `uglify` and `cssnano` (`-O`).

## Install

```sh
$ npm i reactpack --save-dev
```

## Example

<p align="center">
  <img src="demo.gif" alt="reactpack"/>
</p>

## CLI

```
  Usage: reactpack [options] <entry> [path/to/bundle]

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -q, --quiet      no output
    -O, --optimize   optimize
    -w, --watch      watch
    -d, --dev        dev
    -p, --port       port for webpack-dev-server
    --clean          clean everything in bundle path before building
    --no-source-map  output source map
    --no-postcss     do not use postcss
    --no-html        do not output an index.html
    --no-lint        turn off linting
```

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
