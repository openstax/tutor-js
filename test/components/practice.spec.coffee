{expect} = require 'chai'
_ = require 'underscore'
React = require 'react'
Router = require 'react-router'

# Temporary until we update to Router 0.13 where this is exposed
RouterTestLocation = require '../../node_modules/react-router/lib/locations/TestLocation'

{CourseActions, CourseStore} = require '../../src/flux/course'
{SinglePractice} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'


helper = (model, courseId) ->

  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)

  testPracticeLocation = new RouterTestLocation(['dashboard/'])

  div = document.createElement('div')
  Router.run routes, testPracticeLocation, (Handler)->
    React.render(<Handler/>, div, ()->
      console.log div.querySelector('h1')
    )

  # html = React.renderToString(<SinglePractice courseId={courseId} />)
  # div = document.createElement('div')
  # div.innerHTML = html

  # div

describe 'Practice Component', ->
  beforeEach ->
    CourseActions.reset()

  it 'should load expected practice', ->
    node = helper(VALID_MODEL, 1)

    # console.log(node.querySelector('h1'))
    # expect(node.querySelector('h1')).to.not.be.null
    # expect(node.querySelector('h1').innerText).to.equal(VALID_MODEL.title)