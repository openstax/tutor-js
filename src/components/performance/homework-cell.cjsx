React    = require 'react'
CellStatusMixin = require './cell-status-mixin'

module.exports = React.createClass
  displayName: 'HomeworkCell'
  mixins: [CellStatusMixin] # handles rendering

  statusMessage: ->
    msg = if @isLate()
      'Incomplete'
    else
    msg =  "#{@props.task.correct_exercise_count}/#{@props.task.exercise_count}"
    unless @props.task.status is 'completed'
      msg += if @isLate() then ' (Late)' else ' (Incomplete)'
    msg
