EventEmitter2 = require 'eventemitter2'
_ = require 'lodash'
moment = require 'moment'

URLs = require './urls'
EVENT_BUS = new EventEmitter2
POLLERS = {}

NOTICES = []

CLIENT_ID = 'client-specified'
Poller = require './notifications/pollers'

Notifications = {
  POLLING_TYPES:
    MISSING_STUDENT_ID: 'missing_student_id'
    COURSE_HAS_ENDED: 'course_has_ended'

  # for use by specs, not to be considered "public"
  _reset: ->
    @stopPolling()
    NOTICES = []

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
    poller = POLLERS[notice.type]
    if poller # let the poller decide what to do
      poller.acknowledge(notice)
    else
      NOTICES = _.without(NOTICES, _.find(NOTICES, id: notice.id))
      @emit('change')

  getActive: ->
    return NOTICES[0] if NOTICES.length
    for type, poller of POLLERS
      notice = poller.getActiveNotification()
      return notice if notice
    null

  stopPolling: ->
    poller.destroy() for type, poller of POLLERS
    POLLERS = {}

  setCourseRole: (course, role) ->
    return if role.type is 'teacher'
    unless _.isEmpty(role)
      studentId = _.find(course.students, role_id: role.id)?.student_identifier
      if _.isEmpty(studentId) and moment().diff(role.joined_at, 'days') > 7
        @display({type: @POLLING_TYPES.MISSING_STUDENT_ID, course, role})
    if moment(course.ends_at).isBefore(moment(), 'day')
      @display({type: @POLLING_TYPES.COURSE_HAS_ENDED, course, role})

}

# mixin event emitter methods, particulary it's 'on' and 'off'
# since they're compatible with Tutor's bindstore mixin
_.extend Notifications, EVENT_BUS

module.exports = Notifications
