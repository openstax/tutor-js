React = require 'react'
BS = require 'react-bootstrap'

conceptCoach = require '../concept-coach/model'

ExerciseButton = React.createClass
  displayName: 'ExerciseButton'
  propTypes:
    childern: React.PropTypes.node
  getDefaultProps: ->
    children: 'Exercise'
  showExercise: ->
    conceptCoach.channel.emit('show.task', {view: 'task'})
    @props.onClick?()
  render: ->
    <BS.Button onClick={@showExercise}>{@props.children}</BS.Button>

module.exports = {ExerciseButton}
