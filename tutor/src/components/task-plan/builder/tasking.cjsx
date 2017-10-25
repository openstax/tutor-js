React = require 'react'
_     = require 'underscore'
BS    = require 'react-bootstrap'

TimeHelper = require '../../../helpers/time'
TaskingDateTimes = require './tasking-date-times'
{toJS} = require 'mobx'
{TaskingActions, TaskingStore} = require '../../../flux/tasking'

Tasking = React.createClass

  propTypes:
    period:              React.PropTypes.object
    isEditable:          React.PropTypes.bool.isRequired
    isEnabled:           React.PropTypes.bool.isRequired
    isVisibleToStudents: React.PropTypes.bool.isRequired

  togglePeriodEnabled: (toggleEvent) ->
    {id, period} = @props

    if toggleEvent.target.checked
      TaskingActions.enableTasking(id, period.serialize())
    else
      TaskingActions.disableTasking(id, period.serialize())

  render: ->
    {
      isVisibleToStudents,
      period,
      isEditable,
      isEnabled,
      id
    } = @props

    {open_time, due_time} = TaskingStore.getDefaultsForTasking(id, period)
    taskingIdentifier = TaskingStore.getTaskingIndex(period)

    taskingDateTimesProps =
      taskingIdentifier: taskingIdentifier
      required: isEnabled
      ref: 'date-times'

    if isEnabled
      if period?
        <BS.Row key="tasking-enabled-#{taskingIdentifier}" className="tasking-plan tutor-date-input">
          <BS.Col sm=4 md=3>
            <input
              id={"period-toggle-#{taskingIdentifier}"}
              disabled={isVisibleToStudents}
              type='checkbox'
              onChange={@togglePeriodEnabled}
              checked={true}/>
            <label className="period" htmlFor={"period-toggle-#{taskingIdentifier}"}>{period.name}</label>
          </BS.Col>
          <TaskingDateTimes {...@props} {...taskingDateTimesProps}/>
        </BS.Row>
      else
        <TaskingDateTimes {...@props} {...taskingDateTimesProps}/>
    else
      if period?
        # if isVisibleToStudents, we cannot re-enable this task for the period.
        <BS.Row key="tasking-disabled-#{taskingIdentifier}" className="tasking-plan disabled">
          <BS.Col sm=12>
            <input
              id={"period-toggle-#{taskingIdentifier}"}
              type='checkbox'
              disabled={isVisibleToStudents}
              onChange={@togglePeriodEnabled}
              checked={false}/>
            <label className="period" htmlFor={"period-toggle-#{taskingIdentifier}"}>{period.name}</label>
          </BS.Col>
        </BS.Row>
      else
        null

module.exports = Tasking
