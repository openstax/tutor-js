EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'

URLs = require './urls'
EVENT_BUS = new EventEmitter2
POLLERS = {}

pollerFactory = require './notifications/pollers'

Notifications = {

  _asyncStatus: {}

  _startPolling: (type, url) ->
    POLLERS[type] ||= pollerFactory(@, type)
    POLLERS[type].setUrl(url)

  initialize: (bootstrapData, @windowImpl = window) ->

    @_startPolling(
      'accounts', URLs.get('accounts_user')
    ) if URLs.get('accounts_user')

    @_startPolling(
      'tutor', URLs.get('tutor_notices')
    ) if URLs.get('tutor_notices')


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
