React = require 'react'
_ = require 'underscore'
classnames = require 'classnames'

{ChapterSectionMixin} = require 'openstax-react-components'

ExerciseProgress = React.createClass
  displayName: 'ExerciseProgress'
  getDefaultProps: ->
    exercise: {}
  render: ->
    {exercise, className} = @props

    classes = classnames 'concept-coach-progress-exercise', className,
      'is-completed': exercise.is_completed
      'is-correct': exercise.is_correct

    <div className={classes}></div>

module.exports = {ExerciseProgress}
