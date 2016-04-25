# coffeelint: disable=no_empty_functions

React = require 'react'
_ = require 'underscore'

TaskStep = require '../task-step'

ReactCSSTransitionGroup = require 'react-addons-css-transition-group'

Review = React.createClass
  displayName: 'Review'
  propTypes:
    taskId: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired

  getDefaultProps: ->
    focus: false
    onNextStep: ->

  render: ->
    {taskId, steps, focus} = @props

    stepProps = _.omit(@props, 'steps', 'focus')

    stepsList = _.map steps, (step, index) ->
      <TaskStep
        {...stepProps}
        id={step.id}
        key="task-review-#{step.id}"
        # focus on first problem
        focus={focus and index is 0}
        pinned={false}
      />

    <ReactCSSTransitionGroup
      transitionEnterTimeout={500}
      transitionName="homework-review-problem"
    >
      {stepsList}
    </ReactCSSTransitionGroup>

module.exports = Review
