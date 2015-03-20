React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'

{CourseActions, CourseStore} = require '../flux/course'

PracticeButton = React.createClass
  mixins: [Router.Navigation]

  componentWillMount: ->
    CourseStore.on 'practice.loaded', this.transitionToPractice

  componentWillUnmount: ->
    CourseStore.off 'practice.*'

  render: ->
    actionText = if @props.actionText then @props.actionText else 'Practice'

    <BS.Button bsStyle="primary" onClick={@onClick}>{actionText}</BS.Button>

  onClick: ->
    CourseActions.loadPractice(@props.courseId)

  transitionToPractice: (practiceId)->
    if practiceId is @props.loadedTaskId
      @props.reloadPractice?()
    else
      @transitionTo('viewTask', {courseId: @props.courseId, id: practiceId})

module.exports = PracticeButton