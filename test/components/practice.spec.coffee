{expect} = require 'chai'
_ = require 'underscore'
React = require 'react/addons'
Router = require 'react-router'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'



routerHelper = (route, tests) ->
  history = new Router.TestLocation([route])

  div = document.createElement('div')
  Router.run routes, history, (Handler, state)->
    router = @
    React.render(<Handler/>, div, ()->
      component = @
      tests?(div, component, state, router, history)
      React.unmountComponentAtNode(div)
    )

tasksHelper = (courseId, tests) ->
  routerHelper('/courses/' + courseId + '/tasks/', tests)

courseHelper = (model, courseId, tests) ->
  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  routerHelper('/courses/' + courseId + '/practice/', tests)



exerciseTestActions = 
  fillFreeResponse: (node) ->
    textarea = node.querySelector('textarea')
    textarea.value = 'Test Response'
    React.addons.TestUtils.Simulate.focus(textarea)
    React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
    React.addons.TestUtils.Simulate.change(textarea)

    textarea

  clickContinueButton: (node) ->
    continueButton = node.querySelector('button.btn-primary')
    React.addons.TestUtils.Simulate.click(continueButton)
    continueButton = node.querySelector('button.btn-primary')



describe 'Practice Widget', ->
  beforeEach ->
    CourseActions.reset()

  it 'should load the practice button on the course tasks page', (done) ->
    tests = (node) ->

      buttons = Array.prototype.slice.call(node.querySelectorAll('button.btn-primary'))
      practiceButton = _.last(buttons)
      expect(practiceButton.innerText).to.equal('Practice')
      done()

    tasksHelper(1, tests)


  it 'should load expected practice at the practice url', (done) ->
    tests = (node) ->
      expect(node.querySelector('h1')).to.not.be.null
      expect(node.querySelector('h1').innerText).to.equal(VALID_MODEL.title)
      done()

    courseHelper(VALID_MODEL, 1, tests)


  it 'should load allow students to continue exercises', (done) ->
    tests = (node) ->
      continueButton = node.querySelector('button.btn-primary')
      introScreenText = node.innerText

      expect(continueButton).to.not.be.null
      expect(continueButton.innerText).to.equal('Continue')

      React.addons.TestUtils.Simulate.click(continueButton);

      expect(node.innerText).to.not.be.equal(introScreenText)

      done()

    courseHelper(VALID_MODEL, 1, tests)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = (node) ->
      introScreenText = node.innerText

      exerciseTestActions.clickContinueButton(node)

      expect(node.innerText).to.not.be.equal(introScreenText)

      done()

    courseHelper(VALID_MODEL, 1, tests)


  it 'should render multiple choice after free response', (done) ->

    courseId = 1

    tests = (node, component) ->

      continueButton = exerciseTestActions.clickContinueButton(node)

      expect(node.querySelector('.answers-table')).to.be.null
      expect(continueButton.className).to.contain('disabled')
      steps = TaskStore.getSteps(CourseStore.getPracticeId(courseId))

      # not ideal.  wanted to find the step id off of the component's children
      # but that is a pain in the butt right now.
      stepId = steps[0].id
      step = TaskStepStore.get(stepId)

      # Will eventually test based on task type.  Assuming exercise with free
      # response for now.
      expect(step.freeResponse).to.be.undefined
      textarea = exerciseTestActions.fillFreeResponse(node)

      expect(continueButton.className).to.not.contain('disabled')
      React.addons.TestUtils.Simulate.click(continueButton)

      step = TaskStepStore.get(stepId)
      expect(step.free_response).to.equal(textarea.value)

      component.forceUpdate( ->
        expect(node.querySelector('.answers-table')).to.not.be.null
        done()
      )


    courseHelper(VALID_MODEL, courseId, tests)

