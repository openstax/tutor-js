# For handling steps logic outside of breadcrumb and task step rendering.
# Specifically, it returns psuedo steps `intro` and `end` in sequence with real task steps.
_ = require 'underscore'

{TaskActions, TaskStore} = require '../../flux/task'
{TaskStepActions, TaskStepStore} = require '../../flux/task-step'

module.exports =
  # Nice little alias that will return unique values for intro and end as step indexes.
  # This logic need not be buried with render logic anymore, yay!
  getDefaultCurrentStep: ->
    {id} = @props
    defaultIndex = TaskStore.getDefaultStepIndex(id)
    steps = TaskStore.getSteps id

    if defaultIndex is -1 and TaskStore.isTaskCompleted(id)
      defaultIndex = steps.length

    defaultIndex

  shouldStepCrumb: (index) ->
    {id} = @props
    latestIndex = @getDefaultCurrentStep()
    # doesAllowSeeAhead is currently true for if task type is homework.
    doesAllowSeeAhead = TaskStore.doesAllowSeeAhead id

    doesAllowSeeAhead or index <= latestIndex

  _generateCrumbsFromSteps: (task, steps) ->
    crumbs = []
    task.is_completed = TaskStore.isTaskCompleted(task.id)

    # The following pushing of objects onto crumbs could be abstracted some more.
    # That would come in handy for any further case/task specific configuration needed for crumbs
    # Intro
    crumbs.push
      key: -1
      data: task
      crumb: false
      type: 'intro'

    # Step crumbs
    _.each steps, (step, index) =>
      crumbs.push
        key: index
        data: step
        crumb: @shouldStepCrumb index
        type: 'step'

    # Completion
    crumbs.push
      key: steps.length
      data: task
      crumb: @shouldStepCrumb steps.length
      type: 'end'

    crumbs

  _generateCrumbs: (id) ->
    task = TaskStore.get(id)
    steps = TaskStore.getSteps id
    @_generateCrumbsFromSteps task, steps

  generateCrumbs: ->
    {id} = @props
    @_generateCrumbs id

  getCrumableCrumbs: ->
    # only return crumbables for breadcrumbs to render through
    allCrumbs = @generateCrumbs()
    crumbableCrumbs = _.where allCrumbs,
      crumb: true
