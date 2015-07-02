_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'

ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
{RosterStore, RosterActions} = require '../../src/flux/roster'
AdminComponent = require '../../src/components/course-administration/administration'
COURSE_ID = '1'
COURSE = require '../../api/user/courses/1.json'
ROSTER = require '../../api/courses/1/students.json'

render = (courseId = COURSE_ID) ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{courseId}/t/admin").then( (result) ->
      resolve(_.extend({
        view:  ReactTestUtils.findRenderedComponentWithType(result.component, AdminComponent)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Course Administration', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    RosterActions.loaded(ROSTER, COURSE_ID)

    render(COURSE_ID).then (state) =>
      @state = state

  it 'renders period panels', ->
    titles = _.pluck(@state.div.querySelectorAll('.nav-tabs li a'), 'textContent')
    expect(titles)
      .to.deep.equal(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'])

  it 'renders students in the panels', ->
    names = _.pluck(@state.div.querySelectorAll('tbody tr td:first-child'), 'textContent')
    expect(names)
      .to.deep.equal(['Harry Potter', 'Clyde Griffiths', 'Florentino Ariza'])
