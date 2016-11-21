React = require 'react'

classnames = require 'classnames'
{Button} = require 'react-bootstrap'
Icon = require '../icon'

CalendarSidebarToggle = React.createClass

  displayName: 'CalendarSidebarToggle'

  propTypes:
    onToggle: React.PropTypes.func.isRequired
    defaultOpen: React.PropTypes.bool

  getDefaultProps: ->
    defaultOpen: false

  getInitialState: ->
    isOpen: @props.defaultOpen

  componentWillReceiveProps: (nextProps) ->
    @setState(isOpen: nextProps.defaultOpen) if nextProps.defaultOpen?

  onToggle: ->
    isOpen = not @state.isOpen
    @setState({isOpen})
    @props.onToggle(isOpen)

  render: ->
    <Button
      onClick={@onToggle}
      className={classnames("sidebar-toggle", open: @state.isOpen)}
    >
      <Icon type={if @state.isOpen then 'times' else 'bars'} />
      <span className="text">Add Assignment</span>
    </Button>


module.exports = CalendarSidebarToggle
