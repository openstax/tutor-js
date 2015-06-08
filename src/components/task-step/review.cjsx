React = require 'react/addons'
_ = require 'underscore'

TaskStep = require './index'

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

    stepProps = _.omit(@props, 'steps', 'focus')

    stepsList = _.map steps, (step, index) ->
      step = <TaskStep
        id={step.id}
        key="task-review-#{step.id}"
        # focus on first problem
        focus={focus and index is 0}
        pinned={false}
      />

      # transfer props from Review to each step
      _.extend(step.props, stepProps)
      step

    <ReactCSSTransitionGroup transitionName="homework-review-problem">
      {stepsList}
    </ReactCSSTransitionGroup>

module.exports = Review
