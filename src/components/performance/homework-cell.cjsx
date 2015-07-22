React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

module.exports = React.createClass
  displayName: 'HomeworkCell'
  mixins: [CellStatusMixin] # handles rendering

  render: ->
    message = if @isLate()
      'Incomplete'
    else
    message =  "#{@props.task.correct_exercise_count}/#{@props.task.exercise_count}"
    unless @props.task.status is 'completed'
      message += if @isLate() then ' (Late)' else ' (Incomplete)'

    @renderLink({message})
