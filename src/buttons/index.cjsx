React = require 'react'
BS = require 'react-bootstrap'

{channel} = require '../navigation/model'

ExerciseButton = React.createClass
  displayName: 'ExerciseButton'
  propTypes:
    childern: React.PropTypes.node
  getDefaultProps: ->
    children: 'Exercise'
  showExercise: ->
    channel.emit('show.task', {view: 'task'})
    @props.onClick?()
  render: ->
    <BS.Button onClick={@showExercise}>{@props.children}</BS.Button>

module.exports = {ExerciseButton}
