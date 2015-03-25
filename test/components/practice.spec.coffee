{expect} = require 'chai'
_ = require 'underscore'
React = require 'react/addons'
Router = require 'react-router'

# Temporary until we update to Router 0.13 where this is exposed
RouterTestLocation = require '../../node_modules/react-router/lib/locations/TestLocation'

{CourseActions, CourseStore} = require '../../src/flux/course'
{SinglePractice} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'


helper = (model, courseId, tests) ->

  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  testPracticeLocation = new RouterTestLocation(['/courses/' + courseId + '/practice/'])

  div = document.createElement('div')
  Router.run routes, testPracticeLocation, (Handler, state)->
    router = @
    React.render(<Handler/>, div, ()->
      component = @
      tests?(div, component, state, router)
    )

describe 'Practice Component', ->
  beforeEach ->
    CourseActions.reset()

  it 'should load expected practice', (done) ->
    tests = (node) ->
      expect(node.querySelector('h1')).to.not.be.null
      expect(node.querySelector('h1').innerText).to.equal(VALID_MODEL.title)
      done()

    helper(VALID_MODEL, 1, tests)


  it 'should load allow students to continue exercises', (done) ->
    tests = (node) ->
      continueButton = node.querySelector('button.btn-primary')
      introScreenText = node.innerText

      expect(continueButton).to.not.be.null
      expect(continueButton.innerText).to.equal('Continue')

      React.addons.TestUtils.Simulate.click(continueButton);

      expect(node.innerText).to.not.be.equal(introScreenText)

      done()

    helper(VALID_MODEL, 1, tests)


  it 'should render next screen when to continue is clicked', (done) ->
    tests = (node) ->
      continueButton = node.querySelector('button.btn-primary')
      introScreenText = node.innerText

      React.addons.TestUtils.Simulate.click(continueButton);
      expect(node.innerText).to.not.be.equal(introScreenText)

      done()

    helper(VALID_MODEL, 1, tests)

