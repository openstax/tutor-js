React = require 'react'
classnames = require 'classnames'

ExerciseProgress = React.createClass
  displayName: 'ExerciseProgress'
  propTypes:
    className: React.PropTypes.string
    exercise: React.PropTypes.shape(
      is_completed: React.PropTypes.bool
      is_correct: React.PropTypes.bool
    )
  getDefaultProps: ->
    exercise: {}
  render: ->
    {exercise, className} = @props

    classes = classnames 'concept-coach-progress-exercise', className,
      'is-completed': exercise.is_completed
      'is-correct': exercise.is_correct

    <div className={classes}></div>

module.exports = {ExerciseProgress}
