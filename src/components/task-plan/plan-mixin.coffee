React = require 'react'
{TaskPlanStore, TaskPlanActions} = require '../../flux/task-plan'
{TimeStore} = require '../../flux/time'

module.exports =
  contextTypes:
    router: React.PropTypes.func

  getInitialState: ->
    #firefox doesn't like dates with dashes in them
    dateStr = @context?.router?.getCurrentQuery()?.date?.replace(/-/g, '/')
    dueAt = new Date(dateStr)

    # FIXME: Add back the default dueAt
    # if TaskPlanStore.isNew(@props.id) and dateStr and dueAt > TimeStore.getNow()
    #   @setDueAt(dueAt)
    {}

  setOpensAt: (period, value) ->
    {id} = @props
    id ?= @props.planId # FIXME: Ugly nasty hack because Readings and homework use different props
    TaskPlanActions.updateOpensAt(id, period.id, value)

  setDueAt: (period, value) ->
    {id} = @props
    id ?= @props.planId # FIXME: Ugly nasty hack because Readings and homework use different props
    TaskPlanActions.updateDueAt(id, period.id, value)

  setTitle: (title) ->
    {id} = @props
    id ?= @props.planId # FIXME: Ugly nasty hack because Readings and homework use different props
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
    # Hack: Publish is save-and-publish for now
    # TaskPlanActions.publish(id)
    @save()

  save: ->
    {id} = @props
    saveable = TaskPlanStore.isValid(id)
    # The logic here is this way because we need to be able to add an invalid
    # state to the form.  Blame @fredasaurus
    if (saveable)
      TaskPlanStore.addChangeListener(@saved)
      TaskPlanActions.save(id)
    else
      @setState({invalid: true})

  saved: ->
    courseId = @props.courseId
    TaskPlanStore.removeChangeListener(@saved)
    @context.router.transitionTo('taskplans', {courseId})

  cancel: ->
    {id} = @props
    TaskPlanActions.reset(id)
    @context.router.transitionTo('dashboard')
