React = require 'react'
_ = require 'underscore'

TaskTeacherReviewExercise = require './exercise'
LoadableItem = require '../loadable-item'

{TaskTeacherReviewActions, TaskTeacherReviewStore} = require '../../flux/task-teacher-review'
{default: TourRegion} = require '../tours/region'

ReviewHeadingTracker = React.createClass
  displayName: 'ReviewHeadingTracker'
  render: ->
    {sectionLabel, title, sectionKey} = @props

    <h2 data-section={sectionKey}>
      <span className='text-success'>
        {sectionLabel}
      </span> {title}
    </h2>


Review = React.createClass
  displayName: 'Review'
  propTypes:
    id: React.PropTypes.string.isRequired
    focus: React.PropTypes.bool.isRequired
    period: React.PropTypes.object.isRequired
    currentStep: React.PropTypes.number
    steps: React.PropTypes.array.isRequired

  getDefaultProps: ->
    focus: false

  render: ->
    {id, focus, steps} = @props
    stepsProps = _.omit(@props, 'focus')

    stepsList = _.map steps, (step, index) ->
      if step.question_stats?
        return null unless step.content
        stepProps = _.extend({}, stepsProps, step)
        stepProps.key = "task-review-question-#{step.question_stats[0].question_id}-#{index}"
        stepProps.focus = focus and index is 0

        Tracker = TaskTeacherReviewExercise
      else
        stepProps = step
        stepProps.key = "task-review-heading-#{step.sectionLabel}"

        Tracker = ReviewHeadingTracker

      item = <Tracker
        {...stepProps}
        sectionKey={step.key}/>

    <TourRegion id="review-metrics">
      {stepsList}
    </TourRegion>


ReviewShell = React.createClass
  displayName: 'ReviewShell'
  render: ->
    {id} = @props
    <LoadableItem
      id={id}
      store={TaskTeacherReviewStore}
      actions={TaskTeacherReviewActions}
      renderItem={=> <Review {...@props} review='teacher' panel='teacher-review' />}
    />

module.exports = {Review, ReviewShell}
