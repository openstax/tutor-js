# coffeelint: disable=no_empty_functions

React = require 'react/addons'
_ = require 'underscore'

TaskStep = require '../task-step'

ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

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

    stepsList = _.chain steps
      .uniq false, (step) ->
        if step.is_in_multipart and step.content_url?
          step.content_url
        else
          step.id
      .map (step, index) ->
        <TaskStep
          {...stepProps}
          id={step.id}
          key="task-review-#{step.id}"
          # focus on first problem
          focus={focus and index is 0}
          pinned={false}
        />
      .value()

    <ReactCSSTransitionGroup transitionName="homework-review-problem">
      {stepsList}
    </ReactCSSTransitionGroup>

module.exports = Review
