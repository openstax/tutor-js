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
    <Router.Link to='QAViewBook' className="book"
      params={ecosystemId: @props.book.ecosystemId}>
        <span className="title">{@props.book.title}</span>
        <span className="version">{@props.book.version}</span>
    </Router.Link>


module.exports = BookLink
