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
    <Router.Link to='QAViewBook'
      params={ecosystemId: @props.book.id}>
        {@props.book.title}
    </Router.Link>


module.exports = BookLink
