loglevel = require 'loglevel'

defaults = require 'lodash/defaults'
last     = require 'lodash/last'
isObject = require 'lodash/isObject'
debounce = require 'lodash/debounce'

Networking = require '../model/networking'
URLs = require '../model/urls'

PENDING = []
LOG_TO = 'tutor_api'

DEFAULT_OPTIONS =
  warn:
    persist: true
  error:
    persist: true

Logger = {
  levels: ['trace', 'debug', 'info', 'warn', 'error']
  clearPending: ->
    PENDING = []
}

transmitPending = debounce(->
  return unless URLs.hasApiHost(LOG_TO)
  Networking.perform(
    method: 'POST', url: URLs.construct(LOG_TO, 'log', 'entry'),
    data: {entries: PENDING}
  )
  PENDING = []
)

loggerFactory = (level) ->
  (msg, args...) ->
    options = if isObject(last(args)) then args.pop() else {}
    loglevel[level](msg, args...)
    options = defaults(options, DEFAULT_OPTIONS[level])
    if options.persist
      PENDING.push({ message: msg, level: level })
      transmitPending()
    msg

for level in Logger.levels
  Logger[level] = loggerFactory(level)

module.exports = Logger
