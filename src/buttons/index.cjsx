React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

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

ContinueToBookButton = React.createClass
  displayName: 'ContinueToBookButton'
  propTypes:
    childern: React.PropTypes.node
  contextTypes:
    close: React.PropTypes.func
  getDefaultProps: ->
    children: 'Continue to Book'
  continueToBook: ->
    @context.close()
  render: ->
    props = _.omit(@props, 'children')

    <BS.Button {...props} onClick={@continueToBook}>{@props.children}</BS.Button>

module.exports = {ExerciseButton, ContinueToBookButton}
