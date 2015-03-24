{expect} = require 'chai'

React = require 'react'

{CourseActions, CourseStore} = require '../../src/flux/course'
{SinglePractice} = require '../../src/components'

VALID_MODEL = require '../../api/courses/1/practice.json'

helper = (model, courseId) ->

  # Load practice in CourseStore
  CourseActions.loaded(model, courseId)

  html = React.renderToString(<SinglePractice courseId={courseId} />)
  div = document.createElement('div')
  div.innerHTML = html

  div

describe 'Practice Component', ->
  beforeEach ->
    CourseActions.reset()

