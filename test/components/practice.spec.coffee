{expect} = require 'chai'
_ = require 'underscore'
React = require 'react/addons'
Router = require 'react-router'
{Promise} = require('es6-promise')

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'
{TaskStepActions, TaskStepStore} = require '../../src/flux/task-step'

{SinglePractice, Tasks} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'


div = document.createElement('div')

routerHelper = (route) ->
  history = new Router.TestLocation([route])
  promise = new Promise (resolve, reject) ->
    Router.run routes, history, (Handler, state)->
      router = @
      React.render(<Handler/>, div, ()->
        component = @
        result = {div, component, state, router, history}
        resolve(result)
      )

tasksHelper = (courseId) ->
  routerHelper("/courses/#{courseId}/tasks")

courseHelper = (model, courseId) ->
  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  routerHelper("/courses/#{courseId}/practice")



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
    TaskActions.reset()
    TaskStepActions.reset()

  afterEach ->
    React.unmountComponentAtNode(div)

  it 'should load the practice button on the course tasks page', (done) ->
    tests = ({div}) ->
      expect(div.querySelector('.-practice')).to.not.be.null
      done()

    tasksHelper(1).then(tests).catch(done)


  it 'should load expected practice at the practice url', (done) ->
    tests = ({div}) ->
      expect(div.querySelector('h1')).to.not.be.null
      expect(div.querySelector('h1').innerText).to.equal(VALID_MODEL.title)
      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should allow students to continue exercises', (done) ->
    tests = ({div}) ->
      continueButton = div.querySelector('button.btn-primary')
      introScreenText = div.innerText

      expect(continueButton).to.not.be.null
      expect(continueButton.innerText).to.equal('Continue')

      React.addons.TestUtils.Simulate.click(continueButton);

      expect(div.innerText).to.not.be.equal(introScreenText)

      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should render next screen when Continue is clicked', (done) ->
    tests = ({div}) ->
      introScreenText = div.innerText

      exerciseTestActions.clickContinueButton(div)

      expect(div.innerText).to.not.be.equal(introScreenText)

      done()

    courseHelper(VALID_MODEL, 1).then(tests).catch(done)


  it 'should render multiple choice after free response', (done) ->

    courseId = 1

    tests = ({div, component}) ->

      continueButton = exerciseTestActions.clickContinueButton(div)

      expect(div.querySelector('.answers-table')).to.be.null
      expect(continueButton.className).to.contain('disabled')
      steps = TaskStore.getSteps(CourseStore.getPracticeId(courseId))

      # not ideal.  wanted to find the step id off of the component's children
      # but that is a pain in the butt right now.
      stepId = steps[0].id
      step = TaskStepStore.get(stepId)

      # Will eventually test based on task type.  Assuming exercise with free
      # response for now.
      expect(step.free_response).to.be.undefined
      textarea = exerciseTestActions.fillFreeResponse(div)

      expect(continueButton.className).to.not.contain('disabled')
      React.addons.TestUtils.Simulate.click(continueButton)

      step = TaskStepStore.get(stepId)
      expect(step.free_response).to.equal(textarea.value)

      component.forceUpdate( ->
        expect(div.querySelector('.answers-table')).to.not.be.null
        done()
      )

    courseHelper(VALID_MODEL, courseId).then(tests).catch(done)


  # it 'should render ending page', (done) ->

  #   courseId = 1

  #   course = _.clone(VALID_MODEL)

  #   _.each(course.steps, (step) ->
  #       step.is_completed = true
  #       step.correct_answer_id = "id2"
  #       step.answer_id = "id1"
  #       step.free_response = "four"
  #   )

  #   tests = ({div, component}) ->

  #     done()

  #   courseHelper(course, courseId).then(tests).catch(done)

  #   done()


