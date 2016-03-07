# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

POLL_INTERVAL = 5 * 60 * 1000 # 5 minutes

requestUpdates = -> Notifications.actions.loadUpdates()

getObservedNotices = ->
  localStorage.getItem('ox-notifications') or {}

NotificationsConfig = {
  activeNotifications: {}
  _asyncStatus: {}

  startPolling: (manifest_url, windowImpl = window) ->
    @manifest_url = manifest_url
    @manifest_location = this.manifest_url.replace(/\w+.json/, '')
    return if @polling
    @polling = windowImpl.setInterval(requestUpdates, POLL_INTERVAL)
    requestUpdates()

  loadUpdates: ->
  loadedUpdates: (notifications) ->
    observedNotices = getObservedNotices()
    changed = false
    for notice in notifications when not observedNotices[notice.id]
      @activeNotifications[notice.id] = notice
      changed = true
    @emitChange() if changed

  acknowledge: (notice_id) ->
    # localStorage.setItem('ox-notifications',
    #   _.extend( getObservedNotices(), { "#{notice_id}": true } )
    # )
    delete @activeNotifications[notice_id]
    @emitChange()

  exports:
    getManifestUrl: -> @manifest_url
    getActiveNotifications: ->
      _.values @activeNotifications

}

extendConfig(NotificationsConfig, new CrudConfig)
Notifications = {actions, store} = makeSimpleStore(NotificationsConfig)
module.exports = {NotificationActions:actions, NotificationStore:store}
