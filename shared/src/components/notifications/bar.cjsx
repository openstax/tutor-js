React = require 'react'
isEmpty = require 'lodash/isEmpty'
partial = require 'lodash/partial'
without = require 'lodash/without'
classnames = require 'classnames'
Notifications = require '../../model/notifications'

TYPES =
  system: require './system'
  accounts: require './email'
  missing_student_id: require './missing-student-id'

NotificationBar = React.createClass

  propTypes:
    callbacks: React.PropTypes.object.isRequired
    displayAfter: React.PropTypes.number

  getDefaultProps: ->
    displayAfter: 500

  getInitialState: ->
    notice: null

  componentWillMount: ->
    Notifications.on('change', @onChange)
    if @props.role and @props.course
      Notifications.setCourseRole(@props.course, @props.role)
    notice = Notifications.getActive()
    if notice
      displayTimer = setTimeout( (=> @setState({notice})), @props.displayAfter)
      @setState({displayTimer})

  componentWillUnmount: ->
    Notifications.off('change', @onChange)
    clearTimeout(@state.displayTimer) if @state.displayTimer

  onChange: ->
    notice = Notifications.getActive()
    @setState({notice})

  onDismiss: ->
    {notice} = @state
    Notifications.acknowledge(notice)
    @setState({notice: Notifications.getActive()})

  render: ->
    {notice} = @state

    Notice = TYPES[notice?.type or 'system'] or TYPES['system']

    <div className={classnames("openstax-notifications-bar", {viewable: !!notice})}>
      {<Notice
        noticeId={notice.id}
        notice={notice}
        onDismiss={@onDismiss}
        callbacks={@props.callbacks[notice.type]}
      /> if notice}
    </div>


module.exports = NotificationBar
