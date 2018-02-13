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
{ toJS, observable } = require 'mobx'

SETTINGS = mobx.observable.map()

saveSettings = debounce( ->
  Networking.perform(
    method: 'PUT',
    url: URLs.construct('tutor_api', 'user', 'ui_settings')
    withCredentials: true
    config:
      BANG: false
      events:
        failure: false
    onFail: ->
      debugger
    data:
      ui_settings: mobx.toJS(SETTINGS)
  )
, 500)

UiSettings = {

  initialize: (settings) ->
    SETTINGS.replace(observable.object(settings))

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
        obj = {} unless isObject(obj)
        obj[id] = value
        SETTINGS.set(key, observable(toJS(obj)))
    saveSettings()

  # for use by specs to reset
  _reset: ->
    SETTINGS.clear()

  # for debugging purposes
  _dump: -> mobx.toJS(SETTINGS)
}

module.exports = UiSettings
