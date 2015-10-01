React = require 'react'
BS = require 'react-bootstrap'

TeacherContentToggle = React.createClass

  propTypes:
    onChange: React.PropTypes.func.isRequired
    isShowing: React.PropTypes.bool.isRequired

  onClick: ->
    @props.onChange(not @props.isShowing)

  render: ->
    teacherLinkText = if @props.isShowing
      'Hide Teacher Edition'
    else
      'Show Teacher Edition'

    <BS.NavItem className='teacher-edition' onClick={@onClick}>
      {teacherLinkText}
    </BS.NavItem>

module.exports = TeacherContentToggle
