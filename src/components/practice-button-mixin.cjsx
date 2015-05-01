React = require 'react'

{CourseActions, CourseStore} = require '../flux/course'

PracticeButtonMixin =
  contextTypes:
    router: React.PropTypes.func

  propTypes:
    courseId: React.PropTypes.number.isRequired
    pageIds: React.PropTypes.arrayOf(React.PropTypes.number).isRequired
    forceCreate: React.PropTypes.bool
    loadedTaskId: React.PropTypes.string
    reloadPractice: React.PropTypes.func

  componentWillMount: ->
    CourseStore.on('practice.loaded', @transitionToPractice)

  componentWillUnmount: ->
    CourseStore.off('practice.loaded', @transitionToPractice)

  getOrCreatePractice: ->
    {courseId, pageIds, forceCreate} = @props

    if pageIds
      buttonQuery = {page_ids: pageIds}

    CourseActions.createPractice(courseId, buttonQuery)

  transitionToPractice: (practiceId) ->
    {courseId, loadedTaskId} = @props

    if practiceId is loadedTaskId
      @props.reloadPractice?()
    else
      @context.router.transitionTo('viewPractice', {courseId})

module.exports = PracticeButtonMixin
