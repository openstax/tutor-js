# coffeelint: disable=no_empty_functions
{CrudConfig, makeSimpleStore, extendConfig} = require './helpers'
_ = require 'underscore'

STORAGE_KEY   = 'ox-notifications'
POLL_INTERVAL = 5 * 60 * 1000 # 5 minutes


NotificationsConfig = {
  activeNotifications: {}
  _asyncStatus: {}

  startPolling: (windowImpl = window) ->
    return if @polling
    @polling = windowImpl.setInterval(Notifications.actions.pollForUpdate, POLL_INTERVAL)
    @windowImpl = windowImpl
    Notifications.actions.pollForUpdate()

  pollForUpdate: ->
    unless @windowImpl.document.hidden is true
      # Note: this is called using external api, rather than as just @loadUpdates()
      # This is needed so it emits the action that the api listens for
      Notifications.actions.loadUpdates()

  loadUpdates: ->
  loadedUpdates: (notifications) ->
    observedIds = @_getObservedNoticeIds()
    newActiveNotices = {}
    currentIds = []
    for notice in notifications
      currentIds.push(notice.id)
      continue unless observedIds.indexOf(notice.id) is -1
      newActiveNotices[notice.id] = notice

    @activeNotifications = newActiveNotices
    @emitChange()

    # Prune the list of observed notice ids so it doesn't continue to fill up with old notices
    outdatedIds = _.difference(observedIds, _.without(currentIds, _.keys(newActiveNotices)...))
    unless _.isEmpty(outdatedIds)
      @_setObservedNoticeIds( _.without(observedIds, outdatedIds...) )


  # The _get/_set methods below are privatish and aren't called outside the store
  _getObservedNoticeIds: ->
    JSON.parse(@windowImpl.localStorage.getItem(STORAGE_KEY) or '[]')

  _setObservedNoticeIds: (newIds) ->
    @windowImpl.localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds) )

  acknowledge: (notice_id) ->
    @_setObservedNoticeIds(
      @_getObservedNoticeIds().concat(notice_id)
    )
    delete @activeNotifications[notice_id]
    @emitChange()

  exports:
    getActiveNotifications: ->
      _.values @activeNotifications

}

extendConfig(NotificationsConfig, new CrudConfig)
Notifications = {actions, store} = makeSimpleStore(NotificationsConfig)
module.exports = {NotificationActions:actions, NotificationStore:store}
