React = require 'react'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TimeStore} = require '../../flux/time'

module.exports =
  contextTypes:
    router: React.PropTypes.func

  setTitle: (title) ->
    {id} = @props
    TaskPlanActions.updateTitle(id, title)

  showSectionTopics: ->
    @setState({
      showSectionTopics: true
    })

  hideSectionTopics: ->
    @setState({
      showSectionTopics: false
    })

  publish: ->
    {id} = @props
    TaskPlanActions.publish(id)
    @save()

  save: ->
    {id} = @props
    saveable = TaskPlanStore.isValid(id)
    # The logic here is this way because we need to be able to add an invalid
    # state to the form.  Blame @fredasaurus
    if (saveable)
      TaskPlanActions.saved.addListener(@saved)
      TaskPlanActions.save(id)
    else
      @setState({invalid: true})

  saved: ->
    courseId = @props.courseId
    TaskPlanActions.saved.removeListener('change', @saved)
    TaskPlanStore.isLoading(@props.id)
    @context.router.transitionTo('taskplans', {courseId})

  cancel: ->
    {id} = @props
    TaskPlanActions.reset(id)
    @context.router.transitionTo('dashboard')
