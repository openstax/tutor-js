React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'

module.exports = React.createClass
  displayName: 'EventRow'
  
  propTypes:
    cssClass: React.PropTypes.string.isRequired
    event:    React.PropTypes.object.isRequired
    feedback: React.PropTypes.string.isRequired

  render: ->
    <div className="task row #{@props.cssClass}">
      <BS.Col xs={1}  sm={1} className="icon"></BS.Col>
      <BS.Col xs={11} sm={7} className="title">{@props.children}</BS.Col>
      <BS.Col xs={6}  sm={2} className="feedback">{@props.feedback}</BS.Col>
      <BS.Col xs={5}  sm={2} className="due-at">
        {moment(@props.event.due_at).format("ddd, MMMM Do")}
      </BS.Col>
    </div>
