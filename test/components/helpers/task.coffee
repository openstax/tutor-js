{expect} = require 'chai'
_ = require 'underscore'

React = require 'react/addons'
Router = require 'react-router'
{Promise} = require 'es6-promise'

{routes} = require '../../../src/router'
{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'
{TaskActions, TaskStore} = require '../../../src/flux/task'
TaskStep = require '../../../src/components/task-step'

routerStub =
  container: document.createElement('div')

  goTo: (route) ->
    div = @container

    history = new Router.TestLocation([route])
    promise = new Promise (resolve, reject) ->
      Router.run routes, history, (Handler, state)->
        router = @
        try
          React.render(<Handler/>, div, ->
            component = @
            result = {div, component, state, router, history}
            resolve(result)
          )
        catch error
          reject(error)

    promise

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  forceUpdate: (component, args...) ->
    promise = new Promise (resolve, reject) ->
      try
        component.forceUpdate( ->
          resolve(args...)
        )
      catch error
        reject(error)

    promise

taskTestActions = 
  clickButton: (node, selector) ->
    selector ?= 'button.btn-primary'

    button = node.querySelector(selector)
    @click(button)
    button = node.querySelector(selector)


  click: (clickElementNode) ->
    React.addons.TestUtils.Simulate.click(clickElementNode)

  _clickContinue: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    taskTestActions.clickButton(taskDiv, '.-continue')
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  clickContinue: (args...)->
    Promise.resolve(taskTestActions._clickContinue(args...))

  _clickBreadcrumb: (breadcrumbButtonIndex, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    completedBreadcrumbs = taskDiv.querySelectorAll('button.step.completed')
    completedBreadcrumbs = Array.prototype.slice.call(completedBreadcrumbs)

    taskTestActions.click(completedBreadcrumbs[breadcrumbButtonIndex])

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  clickBreadcrumb: (breadcrumbButtonIndex)->
    (args...) ->
      Promise.resolve(taskTestActions._clickBreadcrumb(breadcrumbButtonIndex, args...))

  _fillFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history, response}) ->
    response ?= 'Test Response'

    textarea = taskDiv.querySelector('textarea')
    textarea.value = response
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    {taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}

  fillFreeResponse: (args...)->
    Promise.resolve(taskTestActions._fillFreeResponse(args...))

  saveFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}) ->
    taskTestActions.clickButton(taskDiv, '.-continue')
    TaskStepActions.saved(stepId, {free_response : textarea.value})

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId, taskId, state, router, history})

  pickMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    answer = step.content.questions[0].answers[0]
    answerElement = taskDiv.querySelector('.answer-input-box')

    React.addons.TestUtils.Simulate.change(answerElement, answer)
    TaskStepActions.saved(stepId, {answer_id : answer.id})

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId, taskId, state, router, history, answer})

  saveMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    step = TaskStepStore.get(stepId)
    correct_answer = step.content.questions[0].answers[1]
    feedback_html = 'Fake Feedback'

    taskTestActions.clickButton(taskDiv, '.-continue')

    step.correct_answer_id ?= correct_answer.id
    step.feedback_html = feedback_html
    TaskStepActions.loaded(step, stepId, taskId)

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId, taskId, state, router, history, correct_answer, feedback_html})

  _updateStep: (newStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepId = newStepId
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  updateStep: (args...) ->
    Promise.resolve(taskTestActions._updateStep(args...))

  _advanceStep: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)

    # advance step
    stepId = steps[stepIndex].id
    taskTestActions._updateStep(stepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})

  advanceStep: (args...) ->
    Promise.resolve(taskTestActions._advanceStep(args...))

  _getStepsForCompletion: (taskId) ->
    actionsToNext =
      reading: ['clickContinue']
      interactive: ['clickContinue']
      video: ['clickContinue']
      exercise: ['fillFreeResponse', 'saveFreeResponse', 'pickMultipleChoice', 'saveMultipleChoice', 'clickContinue']
      # TODO handle true and false

    incompleteSteps = TaskStore.getIncompleteSteps(taskId)
    allSteps = TaskStore.getSteps(taskId)
    actions = _.map(incompleteSteps, (step, index) ->
      actionsForStep = _.clone(actionsToNext[step.type])
      if index < incompleteSteps.length - 1
        actionsForStep.push('advanceStep')

      actionsForStep
    )
    actions = _.flatten(actions)

  completeSteps: (args...) ->
    {taskId} = args[0]
    actions = taskTestActions._getStepsForCompletion(taskId)

    actionsFns = _.map(actions, (action) ->
      taskTestActions[action]
    )

    # perform appropriate step actions for each incomplete step
    # by chaining each promised step action
    # Forces promises to execute in order.  The actions are order dependent
    # so Promises.all will not work in this case.
    actionsFns.reduce((current, next) ->
      current.then(next)
    , Promise.resolve(args...))


taskTests =

  container: document.createElement('div')

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  _renderTaskStep: (stepId, taskId, onNextStep) ->
    taskDiv = @container
    promise = new Promise (resolve, reject) ->
      try
        React.render(<TaskStep id={stepId} onNextStep={onNextStep}/>, taskDiv, ->
          taskComponent = @
          resolve({taskDiv, taskComponent, stepId, taskId})
        )
      catch error
        reject(error)

    promise

  renderStep: (taskId) ->
    {id} = TaskStore.getCurrentStep(taskId)
    taskTests = @

    onNextStep = ->
      # TODO Do something for next step.

    @_renderTaskStep(id, taskId, onNextStep)

  goToTask: (route, taskId) ->
    taskDiv = @container
    {id} = TaskStore.getCurrentStep(taskId)

    history = new Router.TestLocation([route])
    promise = new Promise (resolve, reject) ->
      Router.run routes, history, (Handler, state)->
        router = @
        try
          React.render(<Handler/>, taskDiv, ->
            taskComponent = @
            stepId = id

            result = {taskDiv, taskComponent, stepId, taskId, state, router, history}
            resolve(result)
          )
        catch error
          reject(error)

    promise

  allowContinueFromIntro: ({div, component, state, router, history}) ->
    expect(div.querySelector('.-continue')).to.not.be.null

  rendersNextStepOnContinue: ({div, component, state, router, history}) ->
    introScreenText = div.innerText

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  _checkIsTargetStepId: (targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    expect(stepId).to.equal(targetStepId)

    step = TaskStepStore.get(targetStepId)

    componentStepId = taskComponent.getId?()
    if componentStepId
      expect(componentStepId).to.equal(targetStepId)

  _checkIsDefaultStep: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex].id

    taskTests._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkRenderFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    continueButton = taskDiv.querySelector('.-continue')

    expect(taskDiv.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    expect(taskDiv.querySelector('textarea').value).to.equal('')
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkAnswerFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}) ->
    continueButton = taskDiv.querySelector('.-continue')

    expect(continueButton.className).to.not.contain('disabled')

    taskTestActions.click(continueButton)
    TaskStepActions.saved(stepId, {free_response : textarea.value})
    step = TaskStepStore.get(stepId)

    expect(step.free_response).to.equal(textarea.value)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, textarea}

  _checkSubmitFreeResponse: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    expect(taskDiv.querySelector('.answers-table')).to.not.be.null
    expect(taskDiv.querySelector('.answer-checked')).to.be.null
    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkAnswerMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history, answer}) ->
    step = TaskStepStore.get(stepId)

    expect(step.answer_id).to.not.be.null
    expect(step.answer_id).to.equal(answer.id)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, answer}

  _checkSubmitMultipleChoice: ({taskDiv, taskComponent, stepId, taskId, state, router, history, correct_answer, feedback_html}) ->
    expect(taskDiv.querySelector('.answer-correct').innerText).to.equal(correct_answer.content_html)
    expect(taskDiv.querySelector('.answer-correct').innerHTML).to.not.equal(taskDiv.querySelector('.answer-checked').innerHTML)
    expect(taskDiv.querySelector('.question-feedback').innerHTML).to.equal(feedback_html)
    {taskDiv, taskComponent, stepId, taskId, state, router, history, correct_answer, feedback_html}

  _checkIsNextStep: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    stepIndex = TaskStore.getCurrentStepIndex(taskId)
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex - 1].id

    taskTests._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsMatchStep: (stepIndex, {taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    steps = TaskStore.getStepsIds(taskId)
    targetStepId = steps[stepIndex].id

    taskTests._checkIsTargetStepId(targetStepId, {taskDiv, taskComponent, stepId, taskId, state, router, history})

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsNotCompletePage: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(taskDiv.querySelector(".-#{type}-completed")).to.be.null

    {taskDiv, taskComponent, stepId, taskId, state, router, history}

  _checkIsCompletePage: ({taskDiv, taskComponent, stepId, taskId, state, router, history}) ->
    {type} = TaskStore.get(taskId)
    type ?= 'task'
    expect(taskDiv.querySelector(".-#{type}-completed")).to.not.be.null

    {taskDiv, taskComponent, stepId, taskId, state, router, history}


  # promisify for chainability in specs
  checkIsDefaultStep: (args...)->
    Promise.resolve(taskTests._checkIsDefaultStep(args...))
  checkRenderFreeResponse: (args...)->
    Promise.resolve(taskTests._checkRenderFreeResponse(args...))
  checkAnswerFreeResponse: (args...)->
    Promise.resolve(taskTests._checkAnswerFreeResponse(args...))
  checkSubmitFreeResponse: (args...)->
    Promise.resolve(taskTests._checkSubmitFreeResponse(args...))
  checkAnswerMultipleChoice: (args...)->
    Promise.resolve(taskTests._checkAnswerMultipleChoice(args...))
  checkSubmitMultipleChoice: (args...)->
    Promise.resolve(taskTests._checkSubmitMultipleChoice(args...))
  checkIsNextStep: (args...)->
    Promise.resolve(taskTests._checkIsNextStep(args...))
  checkIsMatchStep: (matchStepIndex) ->
    (args...)->
      Promise.resolve(taskTests._checkIsMatchStep(matchStepIndex, args...))
  checkIsNotCompletePage: (args...)->
    Promise.resolve(taskTests._checkIsNotCompletePage(args...))
  checkIsCompletePage: (args...)->
    Promise.resolve(taskTests._checkIsCompletePage(args...))

  renderFreeResponse: (taskId) ->
    @renderStep(taskId)

  answerFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)

  submitFreeResponse: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)

  answerMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTestActions.pickMultipleChoice)

  submitMultipleChoice: (taskId) ->
    @renderStep(taskId)
      .then(taskTestActions.fillFreeResponse)
      .then(taskTestActions.saveFreeResponse)
      .then(taskTestActions.pickMultipleChoice)
      .then(taskTestActions.saveMultipleChoice)

module.exports = {routerStub, taskTestActions, taskTests}
