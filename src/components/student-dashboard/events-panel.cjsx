React = require 'react'
BS    = require 'react-bootstrap'
Time  = require '../time'
ReadingRow      = require './reading-row'
HomeworkRow     = require './homework-row'
EventRow        = require './event-row'
GenericEventRow = require './generic-event-row'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'EventsPanel'

  propTypes:
    events:   React.PropTypes.array.isRequired
    courseId: React.PropTypes.string.isRequired
    startAt:  React.PropTypes.object
    endAt:    React.PropTypes.object
    limit:    React.PropTypes.number
    title:    React.PropTypes.string
    className: React.PropTypes.string

  renderTitle: ->
    # BootstrapReact will overwrite the className attribute with "panel-title"
    # so we use different elements in order to target via styles
    if @props.title
      <h3>{@props.title}</h3>
    else
      <span>
        <Time date={@props.startAt}/> - <Time date={@props.endAt}/>
      </span>

  renderEvent: (event) ->
    switch event.type
      when 'reading'  then <ReadingRow  courseId=@props.courseId key={event.id} event={event}/>
      when 'homework' then <HomeworkRow courseId=@props.courseId key={event.id} event={event}/>
      else
        <GenericEventRow courseId=@props.courseId key={event.id} event={event}/>

  render: ->
    <BS.Panel className={@props.className} header={@renderTitle()}>
      {_.map(@props.events, @renderEvent)}
    </BS.Panel>
