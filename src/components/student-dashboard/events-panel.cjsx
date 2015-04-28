React = require 'react'
BS    = require 'react-bootstrap'
ReadingRow      = require './reading-row'
HomeworkRow     = require './homework-row'
EventRow        = require './event-row'
UnknownEventRow = require './unknown-event-row'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'EventsPanel'

  propTypes:
    events:   React.PropTypes.array.isRequired
    courseId: React.PropTypes.any.isRequired
    startAt:  React.PropTypes.object
    endAt:    React.PropTypes.object
    limit:    React.PropTypes.number
    title:    React.PropTypes.string
    className: React.PropTypes.string

  renderTitle: ->
    if @props.title
      <h3>{@props.title}</h3>
    else
      <span>{@props.startAt.format("MMMM Do")} - {@props.endAt.format("MMMM Do")}</span>

  renderEvent: (event) ->
    switch event.type
      when 'reading'  then <ReadingRow  courseId=@props.courseId key={event.id} event={event}/>
      when 'homework' then <HomeworkRow courseId=@props.courseId key={event.id} event={event}/>
      else
        <UnknownEventRow courseId=@props.courseId key={event.id} event={event}/>

  render: ->
    <BS.Panel className={@props.className} header={@renderTitle()}>
      {_.map(@props.events, @renderEvent)}
    </BS.Panel>
