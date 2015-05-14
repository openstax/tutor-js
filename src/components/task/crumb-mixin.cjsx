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

    if defaultIndex is -1
      if TaskStore.isTaskCompleted(id)
        defaultIndex = steps.length
      else
        defaultIndex = 0

    defaultIndex

  shouldStepCrumb: (index) ->
    {id} = @props
    latestIndex = @getDefaultCurrentStep()

    # doesAllowSeeAhead is currently true for if task type is homework and for practices.
    doesAllowSeeAhead = TaskStore.doesAllowSeeAhead(id)

    doesAllowSeeAhead or index <= latestIndex

  _generateCrumbsFromSteps: (task, steps) ->
    crumbs = []
    task.is_completed = TaskStore.isTaskCompleted(task.id)

    # The following pushing of objects onto crumbs could be abstracted some more.
    # That would come in handy for any further case/task specific configuration needed for crumbs

    # Step crumbs
    _.each steps, (step, index) =>
      crumbs.push
        key: index
        data: step
        crumb: @shouldStepCrumb(index)
        type: 'step'

    # Completion
    crumbs.push
      key: steps.length
      data: task
      crumb: @shouldStepCrumb(steps.length)
      type: 'end'

    crumbs

  _generateCrumbs: (id) ->
    task = TaskStore.get(id)
    steps = TaskStore.getSteps(id)
    crumbs = @_generateCrumbsFromSteps(task, steps)
    @modifyCrumbs(task, crumbs)
    crumbs


  # can possibly abstract this more and pull this out somewhere else if needed in the future
  modifyCrumbs: (task, crumbs) ->
    {currentStep} = @props

    # insert spacer panel/crumb for reading task that have spaced practices or personalized problems
    if task.type is 'reading'
      notCore = _.find crumbs, (crumb) ->
        (crumb.type is 'step') and not TaskStepStore.isCore(crumb.data.id)

      if notCore?
        spacerCrumb =
          data:
            task_id: task.id
            # TODO switch with official icon.  using test as stand-in
            type: 'test'
          crumb: @shouldStepCrumb(notCore.key)
          type: 'spacer'

        crumbs.splice(notCore.key, 0, spacerCrumb)

        # # Comment in to hide next breadcrumb if needed.
        # shouldCrumbnotCore = @shouldStepCrumb(notCore.key + 1) or (notCore.key + 1) is currentStep
        # crumbs[notCore.key + 1].crumb = shouldCrumbnotCore

        # re-key crumbs
        _.each crumbs, (crumb, index) ->
          crumb.key = index


  generateCrumbs: ->
    {id} = @props
    @_generateCrumbs id

  getCrumableCrumbs: ->
    # only return crumbables for breadcrumbs to render through
    allCrumbs = @generateCrumbs()
    crumbableCrumbs = _.where allCrumbs,
      crumb: true
