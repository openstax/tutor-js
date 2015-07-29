_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'

ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
{RosterStore, RosterActions} = require '../../src/flux/roster'
SettingsComponent = require '../../src/components/course-settings/settings'
COURSE_ID = '1'
COURSE = require '../../api/user/courses/1.json'
ROSTER = require '../../api/courses/1/students.json'

render = (courseId = COURSE_ID) ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{courseId}/t/settings").then( (result) ->
      resolve(_.extend({
        view:  ReactTestUtils.findRenderedComponentWithType(result.component, SettingsComponent)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Course Settings', ->

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
    # Pluck the last names from second column.  Should appear in alphabetical order and obey is_active
    for names, tab in [['Potter'], ['Ariza', 'Griffiths']]
      rendered_names = _.pluck(@state.div.querySelectorAll(
        ".tab-content .tab-pane:nth-child(#{tab+1}) tr td:nth-child(2)"
      ), 'textContent')
      expect(rendered_names)
        .to.deep.equal(names)
