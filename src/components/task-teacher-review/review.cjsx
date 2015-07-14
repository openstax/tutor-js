React = require 'react'
_ = require 'underscore'

TaskTeacherReviewExercise = require './exercise'
{ScrollTracker, ScrollTrackerParentMixin} = require '../scroll-tracker'
LoadableItem = require '../loadable-item'

CrumbMixin = require './crumb-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
{ScrollListenerMixin} = require 'react-scroll-components'

{TaskTeacherReviewActions, TaskTeacherReviewStore} = require '../../flux/task-teacher-review'


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
  mixins: [ChapterSectionMixin, CrumbMixin, ScrollListenerMixin, ScrollTrackerParentMixin]
  propTypes:
    id: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired
    period: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number

  getDefaultProps: ->
    focus: false

  render: ->
    {id, focus} = @props
    steps = @getContents()

    stepsProps = _.omit(@props, 'focus')

    stepsList = _.map steps, (step, index) =>

      scrollState = _.pick(step, 'key', 'sectionLabel')
      if step.content?
        stepProps = _.extend({}, stepsProps, step)
        stepProps.key = "task-review-question-#{step.content.questions[0].id}"
        stepProps.focus = focus and index is 0
      else
        stepProps = step
        stepProps.key = "task-review-heading-#{step.sectionLabel}"

      item = <ReviewTracker
        {...stepProps}
        scrollState={scrollState}
        setScrollPoint={@setScrollPoint}
        unsetScrollPoint={@unsetScrollPoint}
      />

    <div>
      {stepsList}
    </div>


ReviewShell = React.createClass
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskTeacherReviewStore}
      actions={TaskTeacherReviewActions}
      renderItem={=> <Review {...@props} review='teacher' panel='teacher-review' />}
    />

module.exports = {Review, ReviewShell}
