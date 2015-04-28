React  = require 'react'
BS     = require 'react-bootstrap'
moment = require 'moment'
Time   = require '../time'

module.exports = React.createClass
  displayName: 'EventRow'
  
  propTypes:
    className: React.PropTypes.string.isRequired
    event:    React.PropTypes.object.isRequired
    feedback: React.PropTypes.string.isRequired

  render: ->
    <div className="task row #{@props.className}">
      <BS.Col xs={1}  sm={1}><i className={"icon-lg icon-#{@props.className}"}/></BS.Col>
      <BS.Col xs={11} sm={7} className="title">{@props.children}</BS.Col>
      <BS.Col xs={6}  sm={2} className="feedback">{@props.feedback}</BS.Col>
      <BS.Col xs={5}  sm={2} className="due-at">
        <Time date={@props.event.due_at}/>
      </BS.Col>
    </div>
