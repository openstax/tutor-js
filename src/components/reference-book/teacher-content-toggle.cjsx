React = require 'react'
BS = require 'react-bootstrap'

TeacherContentToggle = React.createClass

  getInitialState: ->
    isShowing: false

  propTypes:
    onChange: React.PropTypes.func.isRequired

  onClick: ->
    isShowing = not @state.isShowing
    @setState({isShowing})
    @props.onChange(isShowing)

  render: ->
    teacherLinkText = if @state.isShowing
      'Hide Teacher Edition'
    else
      'Show Teacher Edition'

    <BS.Button className='btn-sm teacher-edition' onClick={@onClick}>
      {teacherLinkText}
    </BS.Button>

module.exports = TeacherContentToggle
