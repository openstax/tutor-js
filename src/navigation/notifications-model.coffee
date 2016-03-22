_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'
api = require '../api'

POLL_INTERVAL = 5 * 60 * 1000 # 5 minutes
STORAGE_KEY   = 'ox-cc-notifications'
WINDOW = window
POLLING = null

pollForUpdate = ->
  api.channel.emit('notifications.send.fetch') unless window.document.hidden is true

channel = new EventEmitter2


activeNotifications = {}

getObservedNoticeIds = ->
  JSON.parse(WINDOW.localStorage.getItem(STORAGE_KEY) or '[]')

setObservedNoticeIds = (newIds) ->
  WINDOW.localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds) )

acknowledge = (notice_id) ->
  setObservedNoticeIds(
    getObservedNoticeIds().concat(notice_id)
  )
  delete activeNotifications[notice_id]
  channel.emit('change')


getActive = ->
  _.values activeNotifications


loaded = (resp) ->
  resp.stopErrorDisplay = true
  notifications = resp.data or []
  observedIds = getObservedNoticeIds()
  newActiveNotices = {}
  currentIds = []
  for notice in notifications
    currentIds.push(notice.id)
    continue unless observedIds.indexOf(notice.id) is -1
    newActiveNotices[notice.id] = notice

  activeNotifications = newActiveNotices
  channel.emit('change')

  # Prune the list of observed notice ids so it doesn't continue to fill up with old notices
  outdatedIds = _.difference(observedIds, _.without(currentIds, _.keys(newActiveNotices)...))
  unless _.isEmpty(outdatedIds)
    setObservedNoticeIds( _.without(observedIds, outdatedIds...) )


destroy = (windowImpl = window) ->
  WINDOW = windowImpl
  activeNotifications = {}
  api.channel.off 'notifications.fetch.*', loaded
  WINDOW.clearInterval(POLLING) if POLLING
  POLLING = null


init = (windowImpl = window) ->
  WINDOW = windowImpl
  WINDOW.clearInterval(POLLING) if POLLING
  api.channel.on 'notifications.fetch.*', loaded
  pollForUpdate()
  POLLING = WINDOW.setInterval(pollForUpdate, POLL_INTERVAL)


module.exports = {
  init,
  destroy,
  getActive,
  acknowledge,
  channel,
  loaded
}
