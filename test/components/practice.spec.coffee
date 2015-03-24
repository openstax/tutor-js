{expect} = require 'chai'

React = require 'react'
Router = require 'react-router'

{CourseActions, CourseStore} = require '../../src/flux/course'
{SinglePractice} = require '../../src/components'
{routes} = require '../../src/router'

VALID_MODEL = require '../../api/courses/1/practice.json'
TestLocation =
  history : []


helper = (model, courseId) ->

  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)
  TestLocation.history.push('courses/'+courseId+'/practice/')

  Router.run routes, TestLocation, (Handler)->

  # html = React.renderToString(<SinglePractice courseId={courseId} />)
  # div = document.createElement('div')
  # div.innerHTML = html

  # div

describe 'Practice Component', ->
  beforeEach ->
    CourseActions.reset()

  it 'should load expected practice', ->
    # node = helper(VALID_MODEL, 1)

    # console.log(node.querySelector('h1'))
    # expect(node.querySelector('h1')).to.not.be.null
    # expect(node.querySelector('h1').innerText).to.equal(VALID_MODEL.title)