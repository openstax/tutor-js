_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'

ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
AdminSettings = require '../../src/components/course-administration/settings'
COURSE_ID = '1'
COURSE = require '../../api/user/courses/1.json'

render = (courseId = COURSE_ID) ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{courseId}/t/admin").then( (result) ->
      resolve(_.extend({
        view: ReactTestUtils.findRenderedComponentWithType(result.component, AdminSettings)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Course Administration', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    render(COURSE_ID).then (state) =>
      @state = state

  it 'sets the course name',  ->
    expect(@state.div.querySelector('input[name=name]').value)
      .to.equal(COURSE.name)

  it 'renders period panels', ->
    titles = _.pluck(@state.div.querySelectorAll('.nav-tabs li a'), 'textContent')
    expect(titles)
      .to.deep.equal(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'])
