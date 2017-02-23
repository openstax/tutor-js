{ extend, bindAll, difference, without, keys, isEmpty, values } = require 'lodash'

moment      = require 'moment'
axios       = require 'axios'

User        = require '../user'
UiSettings  = require '../ui-settings'

STORAGE_KEY = 'ox-notifications'

class Poller

  @forType: (notices, type) ->
    new POLLER_TYPES[type](type, notices)

  constructor: (@type, @notices, @interval) ->
    @prefsStorageKey = STORAGE_KEY + '-' + @type
    bindAll(@, 'poll', 'onReply', 'onError')

  setUrl: (@url) ->
    @startPolling() unless @polling

  destroy: ->
    @notices.windowImpl.clearInterval(@polling) if @polling
    delete @polling

  startPolling: ->
    @polling = @notices.windowImpl.setInterval(@poll, @interval.asMilliseconds())
    @poll()

  poll: ->
    return if @notices.windowImpl.document.hidden is true
    axios.get(@url, withCredentials: true).then(@onReply).catch(@onError)

  onReply: ({data}) ->
    console.warn "base onReply method called unnecessarily"

  onError: (resp) ->
    console.warn resp

  getActiveNotifications: ->
    values @_activeNotices

  acknowledge: (notice) ->
    @_setObservedNoticeIds(
      @_getObservedNoticeIds().concat(notice.id)
    )
    delete @_activeNotices[notice.id]
    @notices.emit('change')

  _setObservedNoticeIds: (newIds) ->
    UiSettings.set(@prefsStorageKey, newIds)

  _getObservedNoticeIds: ->
    UiSettings.get(@prefsStorageKey) or []

  _setActiveNotices: (newActiveNotices, currentIds) ->
    @_activeNotices = newActiveNotices
    @notices.emit('change')
    observedIds = @_getObservedNoticeIds()

    # Prune the list of observed notice ids so it doesn't continue to fill up with old notices
    outdatedIds = difference(observedIds, without(currentIds, keys(newActiveNotices)...))
    unless isEmpty(outdatedIds)
      @_setObservedNoticeIds( without(observedIds, outdatedIds...) )


class TutorNotices extends Poller
  constructor: (type, notices) ->
    super(type, notices, moment.duration(5, 'minutes'))
    @active = {}

  onReply: ({data}) ->
    observedIds = @_getObservedNoticeIds()
    notices = {}
    currentIds = []
    for notice in data
      currentIds.push(notice.id)

      continue unless observedIds.indexOf(notice.id) is -1
      notices[notice.id] = extend(notice, {type: @type})

    @_setActiveNotices(notices, currentIds)


class AccountsNagger extends Poller
  constructor: (type, notices) -> super(type, notices, moment.duration(1, 'day'))

  onReply: ({data}) ->
    User.setCurrent(data)
    emails = {}
    for email in User.current().unVerfiedEmails()
      emails[email.id] = extend(email, {type: @type})
    @_setActiveNotices(emails, keys(emails))


POLLER_TYPES =
  tutor: TutorNotices
  accounts: AccountsNagger

module.exports = Poller
