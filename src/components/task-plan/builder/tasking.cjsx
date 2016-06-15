React = require 'react'
Router = require 'react-router'
_ = require 'underscore'
moment = require 'moment-timezone'
BS = require 'react-bootstrap'

TimeHelper = require '../../../helpers/time'
TaskingDateTime = require './date-time'

Tasking = React.createClass
  render: ->
    {
      isVisibleToStudents,
      isEnabled,
      period,
      togglePeriodEnabled,
      isEditable,
    } = @props

    taskingIdentifier = period?.id or 'common'

    if isEnabled
      if period?
        <BS.Row key="tasking-enabled-#{taskingIdentifier}" className="tasking-plan tutor-date-input">
          <BS.Col sm=4 md=3>
            <input
              id={"period-toggle-#{period.id}"}
              disabled={isVisibleToStudents}
              type='checkbox'
              onChange={_.partial(togglePeriodEnabled, period)}
              checked={true}/>
            <label className="period" htmlFor={"period-toggle-#{period.id}"}>{period.name}</label>
          </BS.Col>
          <TaskingDateTimes {...@props} taskingIdentifier={taskingIdentifier}/>
        </BS.Row>
      else
        <TaskingDateTimes {...@props} taskingIdentifier={taskingIdentifier}/>
    else
      if period?
        <BS.Row key="tasking-disabled-#{period.id}" className="tasking-plan disabled">
          <BS.Col sm=12>
            <input
              id={"period-toggle-#{period.id}"}
              type='checkbox'
              disabled={not isVisibleToStudents}
              onChange={_.partial(togglePeriodEnabled, period)}
              checked={false}/>
            <label className="period" htmlFor={"period-toggle-#{period.id}"}>{period.name}</label>
          </BS.Col>
        </BS.Row>
      else
        null

module.exports = Tasking
