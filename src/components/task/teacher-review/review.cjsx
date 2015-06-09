React = require 'react/addons'
_ = require 'underscore'

{ExerciseTeacherReview} = require '../../task-step/exercise/modes'

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

      <ExerciseTeacherReview
        {...stepProps}
        id={step.questions[0].id}
        key="task-review-#{step.questions[0].id}"
        # focus on first problem
        focus={focus and index is 0}
        pinned={false}
      />

    <ReactCSSTransitionGroup transitionName="homework-review-problem">
      {stepsList}
    </ReactCSSTransitionGroup>

module.exports = Review
