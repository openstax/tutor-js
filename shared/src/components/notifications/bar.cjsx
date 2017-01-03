React = require 'react'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'
without = require 'lodash/without'
classnames = require 'classnames'
Notifications = require '../../model/notifications'

# Keep in sync with keys on model/notifications
TYPES =
  system: require './system'
  accounts: require './email'
  "#{Notifications.POLLING_TYPES.MISSING_STUDENT_ID}": require './missing-student-id'
  "#{Notifications.POLLING_TYPES.COURSE_HAS_ENDED}":   require './course-has-ended'

NotificationBar = React.createClass

  propTypes:
    callbacks: React.PropTypes.object.isRequired
    displayAfter: React.PropTypes.number
    className: React.PropTypes.string

  getDefaultProps: ->
    displayAfter: 500

  getInitialState: ->
    notices: []

  componentWillMount: ->
    Notifications.on('change', @onChange)
    if @props.role and @props.course
      Notifications.setCourseRole(@props.course, @props.role)
    notices = Notifications.getActive()
    unless isEmpty(notices)
      displayTimer = setTimeout( (=> @setState({notices})), @props.displayAfter)
      @setState({displayTimer})

  componentWillUnmount: ->
    Notifications.off('change', @onChange)
    clearTimeout(@state.displayTimer) if @state.displayTimer

  onChange: ->
    @setState({notices: Notifications.getActive()})

  onDismiss: (notice) ->
    notice.acknowledged = true

    displayTimer = setTimeout( =>
      Notifications.acknowledge(notice)
      @setState({notices: Notifications.getActive()})
    , @props.displayAfter)

    @setState({displayTimer})

  render: ->
    #console.log @state.notices, Notifications.getActive()

    <div className={
      classnames("openstax-notifications-bar", @props.className, {viewable: not isEmpty(@state.notices)})
    }>
      {for notice in @state.notices or []
        Notice = TYPES[notice?.type or 'system'] or TYPES['system']
        <Notice
          key={notice.id} noticeId={notice.id} notice={notice}
          onDismiss={partial(@onDismiss, notice)} callbacks={@props.callbacks[notice.type]}
        />}
    </div>


module.exports = NotificationBar
