React = require 'react/addons'
ReactCSSTransitionGroup = React.addons.CSSTransitionGroup

_ = require 'underscore'

TaskTeacherReviewExercise = require './exercise'
ScrollTracker = require '../scroll-tracker'


ReviewTracker = React.createClass
  displayName: 'ReviewTracker'
  mixins: [ScrollTracker]
  renderQuestion: ->
    <TaskTeacherReviewExercise {...@props}/>

  renderHeading: ->
    {sectionLabel, title} = @props

    <h2>
      <span className='text-success'>
        {sectionLabel}
      </span> {title}
    </h2>

  render: ->
    {content} = @props

    renderFn = 'renderQuestion'
    renderFn = 'renderHeading' unless content?

    @[renderFn]()



Review = React.createClass
  displayName: 'Review'
  propTypes:
    taskId: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired
    setScrollPoint: React.PropTypes.func.isRequired

  getDefaultProps: ->
    focus: false

  setScrollTopBuffer: ->
    scrollTopBuffer = @getPosition(@getDOMNode())
    @props.setScrollTopBuffer(scrollTopBuffer)

  componentDidMount: ->
    @setScrollTopBuffer()

  getPosition: (el) -> el.getBoundingClientRect().top - document.body.getBoundingClientRect().top

  render: ->
    {taskId, steps, focus} = @props

    stepsProps = _.omit(@props, 'steps', 'focus', 'setScrollTopBuffer')

    stepsList = _.map steps, (step, index) =>

      scrollState = _.pick(step, 'key', 'sectionLabel')

      if step.questions
        stepProps = _.extend({}, stepsProps, {content: step})
        stepProps.key = "task-review-question-#{step.questions[0].id}"
        stepProps.focus = focus and index is 0
      else
        stepProps = step
        stepProps.key = "task-review-heading-#{step.sectionLabel}"

      item = <ReviewTracker
        {...stepProps}
        scrollState={scrollState}
        setScrollPoint={@props.setScrollPoint} />

    <div>
      {stepsList}
    </div>

module.exports = Review
