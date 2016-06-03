# reactpack [![js-standard-style][standard-image]][standard-url]

> one command to build your React frontend.

<p align="center">
  <img src="https://raw.githubusercontent.com/olahol/reactpack/master/reactpack.png" alt="reactpack"/>
</p>

- [x] Unified package, only one `npm i` needed.
- [x] Linting with your `.eslintrc` or with `standard`.
- [x] ES6 with Babel presets `react`, `es2015` and `stage-0`.
- [x] PostCSS with `precss` and `autoprefixer`.
- [x] Style extraction into css bundle.
- [x] Automatic index.html creation with `html-webpack-plugin`.
- [x] Source maps for styles and scripts.
- [x] Watch mode (`--watch`).
- [x] Development server mode (`--dev`).
- [x] Toggle optimizations with `uglify` and `cssnano` (`-O`).

## Install

```sh
$ npm i reactpack -g
```

or

```sh
$ npm i reactpack --save-dev
```

## Example

```js
import React, { Component } from 'react'
import { render } from 'react-dom'

require('bootstrap/dist/css/bootstrap.css')

class Example extends Component {
  render () {
    return <h1>Hello World!</h1>
  }
}

render(<Example />, document.getElementById('react-app'))
```

```javascript
{
  ...
  "scripts": {
    "build": "reactpack src/index.js",
  },
  "dependencies": {
    "bootstrap": "^3.3.6",
    "react": "^15.1.0",
    "react-dom": "^15.1.0",
  },
  "devDependencies": {
    "reactpack": "^0.2.0"
  },
  ...
}
```

<p align="center">
  <img src="https://raw.githubusercontent.com/olahol/reactpack/master/demo.gif" alt="reactpack"/>
</p>

## CLI

```
  Usage: reactpack [options] <entry> [path/to/bundle]

  Options:

    -h, --help       output usage information
    -V, --version    output the version number
    -q, --quiet      no output
    -O, --optimize   optimize css and js using minifiers
    -w, --watch      watch mode, rebuild bundle on file changes
    -d, --dev        start a dev server with hot module replacement
    -p, --port       port for dev server (default is 8000)
    --standard       force standard linting (do not look for eslint config)
    --clean          delete everything in bundle path before building
    --no-source-map  don't output source maps for css and js
    --no-postcss     dont't use postcss (autoprefixer and precss)
    --no-html        don't output an index.html
    --no-lint        turn off linting
```

[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: https://github.com/feross/standard
