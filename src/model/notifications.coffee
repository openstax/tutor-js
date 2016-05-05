EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'

URLs = require './urls'
EVENT_BUS = new EventEmitter2
POLLERS = {}

Poller = require './notifications/pollers'

Notifications = {

  _startPolling: (type, url) ->
    POLLERS[type] ||= Poller.forType(@, type)
    POLLERS[type].setUrl(url)

  startPolling: (@windowImpl = window) ->
    @_startPolling(
      'accounts', URLs.construct('base_accounts', 'api', 'user')
    ) if URLs.get('base_accounts')

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

  stopPolling: ->
    poller.destroy() for type, poller of POLLERS
    POLLERS = {}

}

# mixin event emitter methods, particulary it's 'on' and 'off'
# since they're compatible with Tutor's bindstore mixin
_.extend Notifications, EVENT_BUS

module.exports = Notifications
