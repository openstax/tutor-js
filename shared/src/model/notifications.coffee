EventEmitter2 = require 'eventemitter2'
moment = require 'moment'

clone     = require 'lodash/clone'
defaults  = require 'lodash/defaults'
uniqueId  = require 'lodash/uniqueId'
without   = require 'lodash/without'
extend    = require 'lodash/extend'
find      = require 'lodash/find'
isEmpty   = require 'lodash/isEmpty'

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
    notice = defaults(clone(notice), id: uniqueId(CLIENT_ID), type: CLIENT_ID)
    NOTICES.push(notice) unless find(NOTICES, id: notice.id)
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
      NOTICES = without(NOTICES, find(NOTICES, id: notice.id))
      @emit('change')

  # Notices originate via multiple methods.
  # * Pollers periodically check verious network endpoints
  # * Generated when the `setCourseRole` method is called
  #   based on the user's relationship with the course
  # The `getActive` method is the single point for checking which notifications
  # should be displayed
  getActive: ->
    active = clone(NOTICES)
    for type, poller of POLLERS
      active.push(clone(notice)) for notice in poller.getActiveNotifications()
    active

  stopPolling: ->
    poller.destroy() for type, poller of POLLERS
    POLLERS = {}

  # Called when the current course and/or role has changed
  # The notification logic may display a notice
  # based on the relationship or if student identifier is missing
  setCourseRole: (course, role) ->
    return if isEmpty(role) or role.type is 'teacher'
    studentId = find(course.students, role_id: role.id)?.student_identifier
    if isEmpty(studentId) and moment().diff(role.joined_at, 'days') > 7
      id = @POLLING_TYPES.MISSING_STUDENT_ID
      @display({id, type: id, course, role})
    if moment(course.ends_at).isBefore(moment(), 'day')
      id = @POLLING_TYPES.COURSE_HAS_ENDED
      @display({id,  type: id, course, role})

}

# mixin event emitter methods, particulary it's 'on' and 'off'
# since they're compatible with Tutor's bindstore mixin
extend Notifications, EVENT_BUS

module.exports = Notifications
