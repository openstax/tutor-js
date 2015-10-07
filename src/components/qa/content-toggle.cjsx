React = require 'react'
BS = require 'react-bootstrap'

QAContentToggle = React.createClass

  propTypes:
    onChange: React.PropTypes.func.isRequired
    isShowingBook: React.PropTypes.bool.isRequired

  onClick: ->
    @props.onChange({book: not @props.isShowingBook, exercises: @props.isShowingBook})

  render: ->
    text = if @props.isShowingBook
      'Show Exercises'
    else
      'Show Content'

    <BS.NavItem className='teacher-edition' onClick={@onClick}>
      {text}
    </BS.NavItem>

module.exports = QAContentToggle
