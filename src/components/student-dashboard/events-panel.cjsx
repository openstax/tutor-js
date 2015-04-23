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
    startAt:  React.PropTypes.object
    endAt:    React.PropTypes.object
    limit:    React.PropTypes.number
    title:    React.PropTypes.string

  renderTitle: ->
    if @props.title
      <h3>{@props.title}</h3>
    else
      <span>{@props.startAt.format("MMMM Do")} - {@props.endAt.format("MMMM Do")}</span>

  renderEvent: (event) ->
    switch event.type
      when 'reading'  then <ReadingRow  key={event.id} event={event}/>
      when 'homework' then <HomeworkRow key={event.id} event={event}/>
      else
        <UnknownEventRow key={event.id} event={event}/>

  render: ->
    <BS.Panel header={@renderTitle()}>
      {_.map(@props.events, @renderEvent)}
    </BS.Panel>
