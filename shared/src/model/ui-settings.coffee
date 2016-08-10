_ = require 'underscore'
URLs = require './urls'
Networking = require './networking'

SETTINGS = {}

saveSettings = _.debounce( ->
  Networking.perform(
    method: 'PUT',
    url: URLs.construct('tutor_api', 'users', 'ui_settings')
    withCredentials: true
    data:
      ui_settings: SETTINGS
  )
)

UiSettings = {

  initialize: (settings) ->
    SETTINGS = _.clone(settings)

  get: (key) ->
    SETTINGS[key]

  set: (key, value) ->
    attrs = if _.isObject(key) then key else {"#{key}": value}
    _.extend(SETTINGS, attrs)
    saveSettings()

  # for use by specs to reset
  _reset: ->
    SETTINGS = {}
}


module.exports = UiSettings
