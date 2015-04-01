{expect} = require 'chai'
_ = require 'underscore'

React = require 'react/addons'
Router = require 'react-router'
{Promise} = require 'es6-promise'

{routes} = require '../../../src/router'
{TaskStepActions, TaskStepStore} = require '../../../src/flux/task-step'

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

  # TODO force update wrong somewhere.
  # need to figure this out.
  forceUpdate: (component) ->
    promise = new Promise (resolve, reject) ->
      try
        component.forceUpdate( ->
          resolve(null)
        )
      catch error
        reject(error)

    promise

taskTestActions = 
  fillFreeResponse: (node, component,response) ->
    promise = new Promise (resolve, reject) ->
      try
        response ?= 'Test Response'

        textarea = node.querySelector('textarea')
        textarea.value = response
        React.addons.TestUtils.Simulate.focus(textarea)
        React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
        React.addons.TestUtils.Simulate.change(textarea)

        routerStub.forceUpdate(component).then( ->
          resolve(textarea)
        )
      catch error
        reject(error)

  clickButton: (node, selector) ->
    selector ?= 'button.btn-primary'

    button = node.querySelector(selector)
    @click(button)
    button = node.querySelector(selector)

  click: (clickElementNode) ->
    React.addons.TestUtils.Simulate.click(clickElementNode)


taskTests =

  _promisedStep: (reactProperties, stepId, checkStep) ->
    promise = new Promise (resolve, reject) ->
      try
        taskTests[checkStep](reactProperties, stepId)
        resolve(null)
      catch error
        reject(error)

    promise

  _doStepsHelper: ({div, component, state, router, history}, steps, checkStep) ->
    taskTests = @
    continueButton = taskTestActions.clickButton(div)

    # TODO
    # not ideal.  wanted to find the step id off of the component's children
    # but that is a pain in the butt right now, so assuming step iter is 0 right now.
    # Fixing will likely mean some task refactoring.
    stepIter = 0

    # if step is completed, force update to load the next step
    # TODO add condition for if free response is answered, but step is not complete
    if steps[stepIter].is_completed
      taskTestActions.clickButton(div, '.-continue')

      stepIter = stepIter + 1
      stepId = steps[stepIter].id
      return taskTests._promisedStep({div, component, state, router, history}, stepId, checkStep)


      # return routerStub.forceUpdate(component).then( ->
      #   # new question has been loaded
      #   stepIter = stepIter + 1
      #   stepId = steps[stepIter].id
      #   return taskTests._promisedStep({div, component, state, router, history}, stepId, checkStep)

      #   # need to explict return, es6-promise can only accept certain results
      #   # return null
      # )

    stepId = steps[stepIter].id
    taskTests._promisedStep({div, component, state, router, history}, stepId, checkStep)


  allowContinueFromIntro: ({div, component, state, router, history}) ->
    introScreenText = div.innerText
    expect(div.querySelector('.-continue')).to.not.be.null

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  rendersNextStepOnContinue: ({div, component, state, router, history}) ->
    introScreenText = div.innerText

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  checkForEmptyFreeResponse: ({div, component, state, router, history}, stepId) ->
    continueButton = div.querySelector('.-continue')

    expect(div.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    expect(div.querySelector('textarea').value).to.equal('')

  checkForAnsweredFreeResponse: ({div, component, state, router, history}, stepId) ->
    continueButton = div.querySelector('.-continue')
    taskTestActions.fillFreeResponse(div, component).then((textarea)->
      expect(continueButton.className).to.not.contain('disabled')

      taskTestActions.click(continueButton)

      step = TaskStepStore.get(stepId)
      expect(step.free_response).to.equal(textarea.value)
      TaskStepActions.loaded(step, stepId)
    )

  checkForEmptyMultipleChoice: ({div, component, state, router, history}, stepId) ->
    continueButton = div.querySelector('.-continue')

    taskTestActions.fillFreeResponse(div, component).then((textarea)->
      taskTestActions.click(continueButton)
      expect(div.querySelector('.answers-table')).to.not.be.null
      expect(div.querySelector('.answer-checked')).to.be.null
    )

  checkForAnsweredMultipleChoice: ({div, component, state, router, history}, stepId) ->
    continueButton = div.querySelector('.-continue')
    taskTestActions.fillFreeResponse(div, component).then((textarea)->

      taskTestActions.click(continueButton)
      answer = step.content.questions[0].answers[0]
      React.addons.TestUtils.Simulate.change(div.querySelector('.question'), answer)

      step = TaskStepStore.get(stepId)
      expect(step.answer_id).to.not.be.null
      expect(step.answer_id).to.equal(answer.id)
    )

  checkForSubmittedMultipleChoice: ({div, component, state, router, history}, stepId) ->
    continueButton = div.querySelector('.-continue')
    textarea = taskTestActions.fillFreeResponse(div, component)
    taskTestActions.click(continueButton)

    routerStub.forceUpdate(component).then( ->
      answer = step.content.questions[0].answers[0]
      React.addons.TestUtils.Simulate.change(div.querySelector('.question'), answer)

      step = TaskStepStore.get(stepId)
      correct_answer = step.content.questions[0].answers[1]
      step.correct_answer_id ?= correct_answer.id
      step.feedback_html = 'Fake feedback'
      TaskStepActions.loaded(step, stepId)

      expect(div.querySelector('.answer-correct').innerHTML).to.equal(correct_answer.content_html)
      expect(div.querySelector('.answer-correct').innerHTML).to.not.equal(div.querySelector('.answer-checked').innerHTML)
      expect(div.querySelector('.question-feedback').innerHTML).to.equal(step.feedback_html)

      # need to explict return, es6-promise can only accept certain results
      return null
    )

  renderFreeResponse: (reactProperties, steps) ->
    @_doStepsHelper(reactProperties, steps, 'checkForEmptyFreeResponse')

  submitFreeResponse: (reactProperties, steps) ->
    @_doStepsHelper(reactProperties, steps, 'checkForAnsweredFreeResponse')

  renderMultipleChoiceAfterFreeResponse: (reactProperties, steps) ->
    @_doStepsHelper(reactProperties, steps, 'checkForEmptyMultipleChoice')

  answerMultipleChoice: (reactProperties, steps) ->
    @_doStepsHelper(reactProperties, steps, 'checkForAnsweredMultipleChoice')

  submitMultipleChoice: (reactProperties, steps) ->
    @_doStepsHelper(reactProperties, steps, 'checkForSubmittedMultipleChoice')

module.exports = {routerStub, taskTestActions, taskTests}
