React = require 'react'

classnames = require 'classnames'
{Button} = require 'react-bootstrap'
Icon = require '../../components/icon'
CalendarHelper = require './helper'

OPEN_ICON = 'times'
CLOSED_ICON = 'bars'

CalendarSidebarToggle = React.createClass

  displayName: 'CalendarSidebarToggle'

  propTypes:
    onToggle: React.PropTypes.func.isRequired
    defaultOpen: React.PropTypes.bool

  getDefaultProps: ->
    defaultOpen: false

  getInitialState: ->
    isOpen = CalendarHelper.isSidebarOpen(@props.courseId)
    iconType = if isOpen then OPEN_ICON else CLOSED_ICON
    {isOpen, iconType}

  componentWillMount: ->
    if @state.isOpen
      @props.onToggle(@state.isOpen)
    else
      @setState(pendingIntroTimeout: CalendarHelper.scheduleIntroEvent(@onToggle))

  componentWillUnmount: ->
    CalendarHelper.clearScheduledEvent(@state.pendingIntroTimeout)

  setIconType: ->
    @setState(iconType: if @state.isOpen then OPEN_ICON else CLOSED_ICON)

  onToggle: ->
    isOpen = not @state.isOpen
    CalendarHelper.setSidebarOpen(@props.courseId, isOpen)
    CalendarHelper.clearScheduledEvent(@state.pendingIntroTimeout)
    @setState({isOpen, pendingIntroTimeout: false})
    @props.onToggle(isOpen)

  render: ->
    <Button
      onTransitionEnd={@setIconType}
      onClick={@onToggle}
      className={classnames("sidebar-toggle", open: @state.isOpen)}
    >
      <Icon type={@state.iconType} />
      <span className="text">Add Assignment</span>
    </Button>


module.exports = CalendarSidebarToggle
