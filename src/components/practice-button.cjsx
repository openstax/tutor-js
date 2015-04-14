React = require 'react'
BS = require 'react-bootstrap'
Router = require 'react-router'
_ = require 'underscore'

{CourseActions, CourseStore} = require '../flux/course'

PracticeButton = React.createClass
  displayName: 'PracticeButton'
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.number.isRequired
    pageIds: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    actionText: React.PropTypes.string
    forceCreate: React.PropTypes.bool
    loadedTaskId: React.PropTypes.string
    reloadPractice: React.PropTypes.func

  componentWillMount: ->
    CourseStore.on('practice.loaded', @transitionToPractice)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @transitionToPractice)

  render: ->
    actionText = if @props.actionText then @props.actionText else 'Practice'

    <BS.Button bsStyle="primary" className="-practice" onClick={@onClick}>{actionText}</BS.Button>

  onClick: ->
    {courseId, pageIds, forceCreate} = @props

    if CourseStore.hasPractice(courseId) and not forceCreate
      task = CourseStore.getPractice(courseId)
      @transitionToPractice(task.id)
    else
      CourseActions.createPractice(courseId, {page_ids: pageIds})

  transitionToPractice: (practiceId)->
    {courseId, loadedTaskId} = @props

    if practiceId is loadedTaskId
      @props.reloadPractice?()
    else
      @context.router.transitionTo('viewPractice', {courseId})

module.exports = PracticeButton
