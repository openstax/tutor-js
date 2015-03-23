React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseActions, CourseStore} = require '../flux/course'

PracticeButton = React.createClass
  mixins: [Router.Navigation]

  componentWillMount: ->
    CourseStore.on('practice.loaded', @transitionToPractice)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @transitionToPractice)

  render: ->
    actionText = if @props.actionText then @props.actionText else 'Practice'

    <BS.Button bsStyle="primary" onClick={@onClick}>{actionText}</BS.Button>

  onClick: ->
    if CourseStore.hasPractice(@props.courseId) and not @props.forceCreate
      task = CourseStore.getPractice(@props.courseId)
      @transitionToPractice(task.id)
    else
      CourseActions.createPractice(@props.courseId)

  transitionToPractice: (practiceId)->
    if practiceId is @props.loadedTaskId
      @props.reloadPractice?()
    else
      @transitionTo('viewPractice', {courseId: @props.courseId})

module.exports = PracticeButton