{expect} = require 'chai'
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

  forceUpdate: (component) ->
    promise = new Promise (resolve, reject) ->
      try
        component.forceUpdate( ->
          resolve({})
        )
      catch error
        reject(error)

    promise

taskTestActions = 
  fillFreeResponse: (node, response) ->
    response ?= 'Test Response'

    textarea = node.querySelector('textarea')
    textarea.value = response
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    textarea

  clickButton: (node, selector) ->
    selector ?= 'button.btn-primary'

    button = node.querySelector(selector)
    @click(button)
    button = node.querySelector(selector)

  click: (clickElementNode) ->
    React.addons.TestUtils.Simulate.click(clickElementNode)


taskTests =
  allowContinueFromIntro: ({div, component, state, router, history}) ->
    introScreenText = div.innerText
    expect(div.querySelector('.-continue')).to.not.be.null

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  rendersNextStepOnContinue: ({div, component, state, router, history}) ->
    introScreenText = div.innerText

    taskTestActions.clickButton(div)

    expect(div.innerText).to.not.be.equal(introScreenText)

  checkAndAnswerFreeResponse: ({div, component, state, router, history}, stepId) ->

    continueButton = div.querySelector('.-continue')

    expect(div.querySelector('.answers-table')).to.be.null
    expect(continueButton.className).to.contain('disabled')

    # TODO
    # Will eventually test based on task type.  Assuming exercise with free
    # response for now.
    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.be.undefined
    textarea = taskTestActions.fillFreeResponse(div)

    expect(continueButton.className).to.not.contain('disabled')
    taskTestActions.click(continueButton)

    step = TaskStepStore.get(stepId)
    expect(step.free_response).to.equal(textarea.value)

    routerStub.forceUpdate(component).then( ->
      expect(div.querySelector('.answers-table')).to.not.be.null

      # need to explict return, es6-promise can only accept certain results
      return null
    )

  renderMultipleChoiceAfterFreeResponse: ({div, component, state, router, history}, steps) ->

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

      return routerStub.forceUpdate(component).then( ->
        # new question has been loaded
        stepIter = stepIter + 1
        stepId = steps[stepIter].id
        return taskTests.checkAndAnswerFreeResponse({div, component, state, router, history}, stepId)

        # need to explict return, es6-promise can only accept certain results
        # return null
      )

    stepId = steps[stepIter].id
    taskTests.checkAndAnswerFreeResponse({div, component, state, router, history}, stepId)

module.exports = {routerStub, taskTestActions, taskTests}
