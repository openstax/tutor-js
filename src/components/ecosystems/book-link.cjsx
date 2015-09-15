React = require 'react'
Router = require 'react-router'

BookLink = React.createClass

  propTypes:
    book: React.PropTypes.shape(
      id:      React.PropTypes.number
      title:   React.PropTypes.string
      uuid:    React.PropTypes.string
      version: React.PropTypes.string
    ).isRequired

  render: ->
    <Router.Link to='viewReferenceBookSection'
      params={courseId: @props.book.id, section: '1.1'}>
        {@props.book.title}
    </Router.Link>


module.exports = BookLink
