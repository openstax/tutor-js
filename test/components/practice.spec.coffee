{expect} = require 'chai'
_ = require 'underscore'
React = require 'react/addons'
Router = require 'react-router'

{CourseActions, CourseStore} = require '../../src/flux/course'
{TaskActions, TaskStore} = require '../../src/flux/task'

{SinglePractice, Tasks} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'


tasksHelper = (courseId, tests) ->

  # Load practice in CourseStore
  # CourseActions.loaded(model, courseId)
  history = new Router.TestLocation(['/courses/' + courseId + '/tasks/'])

  div = document.createElement('div')
  Router.run routes, history, (Handler, state)->
    router = @
    React.render(<Handler/>, div, ()->
      component = @
      tests?(div, history, component, state, router)
    )

courseHelper = (model, courseId, tests) ->

  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  history = new Router.TestLocation(['/courses/' + courseId + '/practice/'])

  div = document.createElement('div')
  Router.run routes, history, (Handler, state)->
    router = @
    React.render(<Handler/>, div, ()->
      component = @
      tests?(div, component, state, router)
    )

describe 'Practice Widget', ->
  beforeEach ->
    CourseActions.reset()

  it 'should load the practice button on the course tasks page', (done) ->
    tests = (node, history) ->

      buttons = Array.prototype.slice.call(node.querySelectorAll('button.btn-primary'))
      practiceButton = _.last(buttons)
      # will need to figure this out, but there's some kind of weird this where this triggers
      # again on the practice front page.  the unless is to avoid a false positive.
      expect(practiceButton.innerText).to.equal('Practice') unless node.querySelector('h1')
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
      continueButton = node.querySelector('button.btn-primary')
      introScreenText = node.innerText

      React.addons.TestUtils.Simulate.click(continueButton);
      expect(node.innerText).to.not.be.equal(introScreenText)

      done()

    courseHelper(VALID_MODEL, 1, tests)


  it 'should render multiple choice after free response', (done) ->
    tests = (node) ->
      continueButton = node.querySelector('button.btn-primary')
      React.addons.TestUtils.Simulate.click(continueButton)

      continueButton = node.querySelector('button.btn-primary')

      expect(node.querySelector('.answers-table')).to.be.null
      expect(continueButton.className).to.contain('disabled')

      textarea = node.querySelector('textarea')
      textarea.value = 'Test Response'
      React.addons.TestUtils.Simulate.focus(textarea)
      React.addons.TestUtils.Simulate.keyDown(textarea, {key: 'Enter'})
      React.addons.TestUtils.Simulate.change(textarea)

      expect(continueButton.className).to.not.contain('disabled')

      # React.addons.TestUtils.Simulate.click(continueButton)
      # expect(node.querySelector('.answers-table')).to.not.be.null

      done()

    courseHelper(VALID_MODEL, 1, tests)

