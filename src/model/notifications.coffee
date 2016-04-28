EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'

EVENT_BUS = new EventEmitter2
URL = {}
POLLERS = {}

pollerFactory = require './pollers'

Notifications = {

  _asyncStatus: {}

  # # The _get/_set methods below are privatish and are called only by the poller instances
  # _getObservedNoticeIds: ->
  #   JSON.parse(@windowImpl.localStorage.getItem(STORAGE_KEY) or '[]')
  # _setObservedNoticeIds: (newIds) ->
  #   @windowImpl.localStorage.setItem(STORAGE_KEY, JSON.stringify(newIds) )
  _startPolling: (type, url) ->
    POLLERS[type] ||= pollerFactory(@, type)
    POLLERS[type].setUrl(url)

  initialize: (bootstrapData, @windowImpl = window) ->
    URL.accounts ||= bootstrapData.accounts_notices_url
    URL.profile  ||= bootstrapData.accounts_profile_url

    @_startPolling(
      'accounts', bootstrapData.accounts_notices_url
    ) if bootstrapData.accounts_notices_url

    @_startPolling(
      'tutor', bootstrapData.tutor_notices_url
    ) if bootstrapData.tutor_notices_url


  acknowledge: (notice) ->
    POLLERS[notice.type].acknowledge(notice)

  getActive: ->
    notices = []
    for type, poller of POLLERS
      notices = notices.concat( poller.getActiveNotifications() )
    notices

}

# mixin event emitter methods, particulary it's 'on' and 'off'
# since they're compatible with Tutor's bindstore mixin
_.extend Notifications, EVENT_BUS

module.exports = Notifications
