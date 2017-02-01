React = require 'react'
BS    = require 'react-bootstrap'
Time  = require '../time'
moment = require 'moment'
ReadingRow      = require './reading-row'
HomeworkRow     = require './homework-row'
ExternalRow     = require './external-row'
EventTaskRow        = require './event-task-row'
EventRow        = require './event-row'
GenericEventRow = require './generic-event-row'
_ = require 'underscore'

module.exports = React.createClass
  displayName: 'EventsPanel'

  propTypes:
    events:     React.PropTypes.array.isRequired
    courseId:   React.PropTypes.string.isRequired
    isCollege:  React.PropTypes.bool.isRequired
    startAt:    React.PropTypes.object
    endAt:      React.PropTypes.object
    limit:      React.PropTypes.number
    title:      React.PropTypes.string
    className:  React.PropTypes.string

  renderTitle: ->
    if @props.title
      <span className="title">{@props.title}</span>
    else
      <span className="date-range">
        <Time date={moment(@props.startAt).toDate()}/>
           &ndash;
        <Time date={moment(@props.endAt).toDate()}/>
      </span>

  renderEvent: (event) ->
    rowProps =
      courseId:   @props.courseId
      isCollege:  @props.isCollege
      key:        event.id
      event:      event

    switch event.type
      when 'reading'  then <ReadingRow {...rowProps}/>
      when 'homework' then <HomeworkRow {...rowProps}/>
      when 'external' then <ExternalRow {...rowProps}/>
      when 'event' then <EventTaskRow {...rowProps}/>
      else
        <GenericEventRow {...rowProps}/>

  render: ->
    <BS.Panel className={@props.className}>
      <div className="row labels">
        <BS.Col xs={12} sm={7}>{@renderTitle()}</BS.Col>
        <BS.Col xs={5} xsOffset={2} smOffset={0} sm={3} className='progress-label'>
          Progress
        </BS.Col>
        <BS.Col xs={5} sm={2} className='due-at-label'>Due</BS.Col>
      </div>
      {_.map(@props.events, @renderEvent)}
    </BS.Panel>
