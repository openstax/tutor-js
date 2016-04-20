React = require 'react'
{ Link } = require 'react-router'

BookLink = React.createClass

  propTypes:
    book: React.PropTypes.shape(
      ecosystemId: React.PropTypes.string
      ecosystemComments: React.PropTypes.string
      id:      React.PropTypes.number
      title:   React.PropTypes.string
      uuid:    React.PropTypes.string
      version: React.PropTypes.string
    ).isRequired

  render: ->
    <Link to="/qa/#{@props.book.ecosystemId}" className="book">
        <div className="title-version">
          <span>{@props.book.title}</span>
          <span>{@props.book.version}</span>
        </div>
        <span className="comments">{@props.book.ecosystemComments}</span>
    </Link>


module.exports = BookLink
