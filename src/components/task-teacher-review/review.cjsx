React = require 'react/addons'
_ = require 'underscore'

TaskTeacherReviewExercise = require './exercise'

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

Review = React.createClass
  displayName: 'Review'
  propTypes:
    taskId: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired

  getDefaultProps: ->
    focus: false

  render: ->
    {taskId, steps, focus} = @props

    stepsProps = _.omit(@props, 'steps', 'focus')

    stepsList = _.map steps, (step, index) ->

      stepProps = _.extend({}, stepsProps, {content: step})

      <TaskTeacherReviewExercise
        {...stepProps}
        id={step.questions[0].id}
        key="task-review-#{step.questions[0].id}"
        # focus on first problem
        focus={focus and index is 0}
      />

    <ReactCSSTransitionGroup transitionName="homework-review-problem">
      {stepsList}
    </ReactCSSTransitionGroup>

module.exports = Review
