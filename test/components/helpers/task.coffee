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


  _fillFreeResponse: ({taskDiv, taskComponent, stepId, response}) ->
    response ?= 'Test Response'

    textarea = taskDiv.querySelector('textarea')
    textarea.value = response
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    {taskDiv, taskComponent, stepId, textarea}

  fillFreeResponse: (args...)->
    Promise.resolve(taskTestActions._fillFreeResponse(args...))

  saveFreeResponse: ({taskDiv, taskComponent, stepId, textarea}) ->
    taskTestActions.clickButton(taskDiv, '.-continue')
    TaskStepActions.saved(stepId, {free_response : textarea.value})

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId})

  pickMultipleChoice: ({taskDiv, taskComponent, stepId}) ->
    step = TaskStepStore.get(stepId)
    answer = step.content.questions[0].answers[0]
    answerElement = taskDiv.querySelector('.answer-input-box')

    React.addons.TestUtils.Simulate.change(answerElement, answer)
    TaskStepActions.saved(stepId, {answer_id : answer.id})

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId, answer})

  saveMultipleChoice: ({taskDiv, taskComponent, stepId}) ->
    step = TaskStepStore.get(stepId)
    correct_answer = step.content.questions[0].answers[1]
    feedback_html = 'Fake Feedback'

    taskTestActions.clickButton(taskDiv, '.-continue')

    step.correct_answer_id ?= correct_answer.id
    step.feedback_html = feedback_html
    TaskStepActions.loaded(step, stepId)

    routerStub.forceUpdate(taskComponent, {taskDiv, taskComponent, stepId, correct_answer, feedback_html})


taskTests =

  container: document.createElement('div')

  unmount: ->
    React.unmountComponentAtNode(@container)
    @container = document.createElement('div')

  _renderTaskStep: (stepId, onNextStep) ->
    taskDiv = @container
    promise = new Promise (resolve, reject) ->
      try
        React.render(<TaskStep id={stepId} onNextStep={onNextStep}/>, taskDiv, ->
          taskComponent = @
          resolve({taskDiv, taskComponent, stepId})
        )
      catch error
        reject(error)

    promise

  renderStep: (taskId) ->
    {id} = TaskStore.getCurrentStep(taskId)
    taskTests = @

    onNextStep = ->
      # TODO Do something for next step.

    @_renderTaskStep(id, onNextStep)


  allowContinueFromIntro: ({div, component, state, router, history}) ->
    introScreenText = div.innerText
    expect(div.querySelector('.-continue')).to.not.be.null

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  rendersNextStepOnContinue: ({div, component, state, router, history}) ->
    introScreenText = div.innerText

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  _checkRenderFreeResponse: ({taskDiv, taskComponent, stepId}) ->
    continueButton = taskDiv.querySelector('.-continue')

    expect(taskDiv.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    expect(taskDiv.querySelector('textarea').value).to.equal('')
    {taskDiv, taskComponent, stepId}

  _checkAnswerFreeResponse: ({taskDiv, taskComponent, stepId, textarea}) ->
    continueButton = taskDiv.querySelector('.-continue')

    expect(continueButton.className).to.not.contain('disabled')

    taskTestActions.click(continueButton)
    TaskStepActions.saved(stepId, {free_response : textarea.value})
    step = TaskStepStore.get(stepId)

    expect(step.free_response).to.equal(textarea.value)
    {taskDiv, taskComponent, stepId, textarea}

  _checkSubmitFreeResponse: ({taskDiv, taskComponent, stepId}) ->
    expect(taskDiv.querySelector('.answers-table')).to.not.be.null
    expect(taskDiv.querySelector('.answer-checked')).to.be.null
    {taskDiv, taskComponent, stepId}

  _checkAnswerMultipleChoice: ({taskDiv, taskComponent, stepId, answer}) ->
    step = TaskStepStore.get(stepId)

    expect(step.answer_id).to.not.be.null
    expect(step.answer_id).to.equal(answer.id)
    {taskDiv, taskComponent, stepId, answer}

  _checkSubmitMultipleChoice: ({taskDiv, taskComponent, stepId, correct_answer, feedback_html}) ->
    expect(taskDiv.querySelector('.answer-correct').innerText).to.equal(correct_answer.content_html)
    expect(taskDiv.querySelector('.answer-correct').innerHTML).to.not.equal(taskDiv.querySelector('.answer-checked').innerHTML)
    expect(taskDiv.querySelector('.question-feedback').innerHTML).to.equal(feedback_html)
    {taskDiv, taskComponent, stepId, correct_answer, feedback_html}

  # promisify for chainability in specs
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
