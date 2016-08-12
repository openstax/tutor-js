EventEmitter2 = require 'eventemitter2'
_ = require 'underscore'

URLs = require './urls'
EVENT_BUS = new EventEmitter2
POLLERS = {}

NOTICES = []

CLIENT_ID = 'client-specified'
Poller = require './notifications/pollers'

Notifications = {

  display: (notice) ->
    # fill in an id and type if not provided
    NOTICES.push( _.defaults(_.clone(notice), id: _.uniqueId(CLIENT_ID), type: CLIENT_ID ))
    @emit('change')

  _startPolling: (type, url) ->
    POLLERS[type] ||= Poller.forType(@, type)
    POLLERS[type].setUrl(url)

  startPolling: (@windowImpl = window) ->
    @_startPolling(
      'accounts', URLs.construct('accounts_api', 'user')
    ) if URLs.get('accounts_api')

    @_startPolling(
      'tutor', URLs.construct('tutor_api', 'notifications')
    ) if URLs.get('tutor_api')


  acknowledge: (notice) ->
    if notice.type is CLIENT_ID
      NOTICES = _.without(NOTICES, _.findWhere(NOTICES, id: notice.id))
      @emit('change')
    else
      POLLERS[notice.type].acknowledge(notice)

  getActive: ->
    notices = _.clone NOTICES
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
