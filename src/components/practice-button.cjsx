React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'

PracticeButton = React.createClass
  contextTypes:
    router: React.PropTypes.func

  componentWillMount: ->
    CourseStore.on('practice.loaded', @transitionToPractice)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @transitionToPractice)

  render: ->
    actionText = if @props.actionText then @props.actionText else 'Practice'

    <BS.Button bsStyle="primary" className="-practice" onClick={@onClick}>{actionText}</BS.Button>

  onClick: ->
    params = _.pick(@props, 'page_ids')

    if CourseStore.hasPractice(@props.courseId) and not @props.forceCreate
      task = CourseStore.getPractice(@props.courseId)
      @transitionToPractice(task.id)
    else
      CourseActions.createPractice(@props.courseId, params)

  transitionToPractice: (practiceId)->

    if practiceId is @props.loadedTaskId
      @props.reloadPractice?()
    else
      @context.router.transitionTo('viewPractice', {courseId: @props.courseId})

module.exports = PracticeButton
