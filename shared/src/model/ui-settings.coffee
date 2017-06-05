get       = require 'lodash/get'
setWith   = require 'lodash/setWith'
debounce  = require 'lodash/debounce'
includes  = require 'lodash/includes'
assign    = require 'lodash/assign'
isObject  = require 'lodash/isObject'
isNil     = require 'lodash/isNil'
cloneDeep = require 'lodash/cloneDeep'
mobx = require 'mobx'
URLs = require './urls'
Networking = require './networking'

SETTINGS = mobx.observable.map()

saveSettings = debounce( ->
  Networking.perform(
    method: 'PUT',
    url: URLs.construct('tutor_api', 'user', 'ui_settings')
    withCredentials: true
    data:
      ui_settings: mobx.toJS(SETTINGS)
  )
, 500)

UiSettings = {

  initialize: (settings) ->
    SETTINGS.replace(settings)

  get: (key, id) ->
    obj = SETTINGS.get(key)
    if (not isNil(id) and isObject(obj)) then obj[id] else obj

  set: (key, id, value) ->
    if isObject(key)
      SETTINGS.merge(key)
    else
      if isNil(value)
        SETTINGS.set(key, id)
      else
        obj = SETTINGS.get(key) or {}
        obj[id] = value
        SETTINGS.set(key, obj)
    saveSettings()

  # for use by specs to reset
  _reset: ->
    SETTINGS.clear()

  # for debugging purposes
  _dump: -> mobx.toJS(SETTINGS)
}

module.exports = UiSettings
