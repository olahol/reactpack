var characterSet = require('cli-character-set')
var logUpdate = require('log-update')
var padLeft = require('lodash.padleft')
var padRight = require('lodash.padright')
var util = require('util')

require('colour')

var themes = {
  unicode: {
    complete: '▓',
    incomplete: '░'
  },
  ascii: {
    complete: '#',
    incomplete: '-'
  },
  cp437: {
    complete: '█',
    incomplete: '░'
  }
}

var ProgressBar = function () {
  this.msg = ''
  this.spun = 0
  this.progress = 0
  this.theme = themes[characterSet()]
  this._largestMsgWidth = 0
}

ProgressBar.prototype._columns = function () {
  return process.stdout.columns - 2
}

ProgressBar.prototype._getFullMsg = function () {
  return util.format('%s', padRight(this.msg, this._largestMsgWidth))
}

ProgressBar.prototype._getProgressBar = function () {
  var self = this
  var percentage = this.progress

  function getProgressWidth () {
    return self._columns() - self._getFullMsg().length
  }

  function getComplete (percentage) {
    return padLeft('', (percentage * getProgressWidth()), self.theme.complete)
  }

  function getIncomplete (percentage) {
    var width = getProgressWidth() - (percentage * getProgressWidth())
    return padRight('', width, self.theme.incomplete)
  }

  var complete = getComplete(percentage).blue
  var incomplete = getIncomplete(percentage)

  return complete + incomplete
}

ProgressBar.prototype.show = function (msg, percentage) {
  this.msg = msg.trim() === '' ? this.msg : msg
  this._largestMsgWidth = Math.max(msg.length, this._largestMsgWidth)
  this.progress = percentage || this.progress
  this._draw()
}

ProgressBar.prototype.hide = function () {
  logUpdate.clear()
}

ProgressBar.prototype._draw = function () {
  var bar = this._getProgressBar(this.progress)
  var msg = this._getFullMsg()

  logUpdate(util.format('%s %s', msg, bar))
}

module.exports = ProgressBar
