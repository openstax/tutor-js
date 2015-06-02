_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{CourseListing} = require '../../src/components/course-listing'
{CourseListingActions, CourseListingStore} = require '../../src/flux/course-listing'
{StudentDashboardShell} = require '../../src/components/student-dashboard'
CourseCalendar = require '../../src/components/course-calendar'
{
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
  MASTER_COURSES_LIST
} = require '../courses-test-data'


renderListing = ->
  new Promise (resolve, reject) ->
    routerStub.goTo('/dashboard').then (result) ->
      resolve(_.extend({
        listing: ReactTestUtils.scryRenderedComponentsWithType(result.component, CourseListing)[0]
      }, result))

describe 'Course Listing Component', ->

  beforeEach ->
    CourseListingActions.reset()

  it 'renders the listing', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    renderListing().then (state) ->
      renderedTitles = _.pluck(state.div.querySelectorAll('h1'), 'textContent')
      for course, i in MASTER_COURSES_LIST
        expect(renderedTitles[i]).to.contain(MASTER_COURSES_LIST[i].name)

  it 'redirects to student dashboard', ->
    CourseListingActions.loaded([STUDENT_COURSE_ONE_MODEL])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, StudentDashboardShell))
        .to.have.length(1)

  it 'redirects to teacher calendar', ->
    CourseListingActions.loaded([TEACHER_COURSE_TWO_MODEL])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, CourseCalendar))
        .to.have.length(1)
