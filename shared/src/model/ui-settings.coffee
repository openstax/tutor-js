get       = require 'lodash/get'
setWith   = require 'lodash/set'
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

    # key else
    # attrVal = SETTINGS, key)
    saveSettings()

  # for use by specs to reset
  _reset: ->
    SETTINGS = {}

  _migrateBadKeys: ->
    badKeys = []
    for key, value of SETTINGS
      if includes(key, '.') # legacy key from before we were using lodash set
        setWith(SETTINGS, key, value, Object)
        badKeys.push(key)
    if badKeys.length
      delete SETTINGS[key] for key in badKeys
      saveSettings()

  # for debugging purposes
  _dump: -> cloneDeep(SETTINGS)
}

module.exports = UiSettings
