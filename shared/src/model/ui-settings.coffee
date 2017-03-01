get       = require 'lodash/get'
setWith   = require 'lodash/setWith'
debounce  = require 'lodash/debounce'
includes  = require 'lodash/includes'
assign    = require 'lodash/assign'
isObject  = require 'lodash/isObject'
cloneDeep = require 'lodash/cloneDeep'
URLs = require './urls'
Networking = require './networking'

SETTINGS = {}
PREVIOUS_SETTINGS = {}

saveSettings = debounce( ->
  Networking.perform(
    method: 'PUT',
    url: URLs.construct('tutor_api', 'user', 'ui_settings')
    withCredentials: true
    data:
      previous_ui_settings: PREVIOUS_SETTINGS
      ui_settings: SETTINGS
  ).then( ->
    PREVIOUS_SETTINGS = cloneDeep SETTINGS
  )
, 10)

UiSettings = {

  initialize: (settings) ->
    SETTINGS = cloneDeep(settings) or {}
    PREVIOUS_SETTINGS = cloneDeep SETTINGS
    this._migrateBadKeys()

  get: (key) ->
    get(SETTINGS, key)

  set: (key, value) ->
    if isObject(key)
      assign(SETTINGS, key)
    else
      setWith(SETTINGS, key, value, Object)
    saveSettings()

  # for use by specs to reset
  _reset: ->
    SETTINGS = {}

  _migrateBadKeys: ->
    badKeys = []
    keys = Object.getOwnPropertyNames(SETTINGS) # make a copy since it'll be mutated
    for key in keys
      if includes(key, '.') # legacy key from before we were using lodash set
        value = SETTINGS[key]
        delete SETTINGS[key]
        setWith(SETTINGS, key, value, Object)
        badKeys.push(key)

    saveSettings() if badKeys.length

  # for debugging purposes
  _dump: -> cloneDeep(SETTINGS)
}

module.exports = UiSettings
