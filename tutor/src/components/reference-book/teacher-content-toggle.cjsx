_     = require 'underscore'
BS    = require 'react-bootstrap'
React = require 'react'

# NOTE: this selector must be kept in sync with CNX as well as
# the style in components/reference-book/page.less
TEACHER_CONTENT_SELECTOR = '.os-teacher'

TeacherContentToggle = React.createClass

  propTypes:
    onChange:   React.PropTypes.func.isRequired
    isShowing:  React.PropTypes.bool
    section:    React.PropTypes.string
    windowImpl: React.PropTypes.object

  getDefaultProps: ->
    windowImpl: window

  getInitialState: ->
    hasTeacherContent: false

  onClick: (ev) ->
    ev.preventDefault()
    @props.onChange(not @props.isShowing) if @state.hasTeacherContent is true

  componentDidMount:      -> @scheduleCheckForTeacherContent()
  componentDidUpdate:     -> @scheduleCheckForTeacherContent()
  componentWillUnmount:   -> clearTimeout(@state.pendingCheck) if @state.pendingCheck
  scheduleCheckForTeacherContent: ->
    return if @state.pendingCheck
    @setState(pendingCheck: _.defer(@checkForTeacherContent))

  checkForTeacherContent: ->
    @setState(
      pendingCheck: false
      hasTeacherContent: !!@props.windowImpl.document.querySelector(TEACHER_CONTENT_SELECTOR)
    )

  renderNoContentTooltip: ->
    <BS.Popover id='no-content'>
      No teacher edition content is available for this page.
    </BS.Popover>

  render: ->
    teacherLinkText = if @props.isShowing
      'Hide Teacher Edition'
    else
      'Show Teacher Edition'

    content = if @state.hasTeacherContent
      <span className="has-content">{teacherLinkText}</span>
    else
      <BS.OverlayTrigger
        placement='bottom' trigger='click' overlay={@renderNoContentTooltip()}
      >
        <span className="no-content">{teacherLinkText}</span>
      </BS.OverlayTrigger>


    <BS.NavItem className='teacher-edition' onClick={@onClick}>
      {content}
    </BS.NavItem>

module.exports = TeacherContentToggle
