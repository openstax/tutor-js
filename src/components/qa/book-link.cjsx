React = require 'react'
Router = require 'react-router'

BookLink = React.createClass

  propTypes:
    book: React.PropTypes.shape(
      ecosystemId: React.PropTypes.string
      id:      React.PropTypes.number
      title:   React.PropTypes.string
      uuid:    React.PropTypes.string
      version: React.PropTypes.string
    ).isRequired

  render: ->
    <Router.Link to='QAViewBook'
      params={ecosystemId: @props.book.ecosystemId}>
        {@props.book.title}
    </Router.Link>


module.exports = BookLink
