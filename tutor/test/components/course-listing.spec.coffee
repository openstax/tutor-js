_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'
{sinon}        = require './helpers/component-testing'
{CourseListing} = require '../../src/components/course-listing'
{CourseListingActions, CourseListingStore} = require '../../src/flux/course-listing'
{CourseActions} = require '../../src/flux/course'
{StudentDashboardShell} = require '../../src/components/student-dashboard'
CourseCalendar = require '../../src/components/course-calendar'
WindowHelpers  = require '../../src/helpers/window'

{
  STUDENT_COURSE_ONE_MODEL
  TEACHER_COURSE_TWO_MODEL
  TEACHER_AND_STUDENT_COURSE_THREE_MODEL
  MASTER_COURSES_LIST,
  TUTOR_HELP,
  CONCEPT_COACH_HELP,
  STUDENT_ARCHIVED_COURSE
} = require '../courses-test-data'


renderListing = ->
  new Promise (resolve, reject) ->
    routerStub.goTo('/dashboard').then (result) ->
      resolve(_.extend({
        listing: ReactTestUtils.scryRenderedComponentsWithType(result.component, CourseListing)[0]
      }, result))

describe 'Course Listing Component', ->

  it 'renders the listing', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    renderListing().then (state) ->
      renderDataset = _.pluck(state.div.querySelectorAll('.tutor-booksplash-course-item'), 'dataset')
      for course, i in MASTER_COURSES_LIST
        expect(MASTER_COURSES_LIST[i].name).to.contain(renderDataset[i].title)
      # no refresh button when load succeeds
      expect(state.div.querySelector(".refresh-button")).to.be.null

  it 'renders the listing without archived courses', ->
    courseList = _.flatten([MASTER_COURSES_LIST, STUDENT_ARCHIVED_COURSE])
    CourseListingActions.loaded(courseList)
    renderListing().then (state) ->
      renderDataset = _.pluck(state.div.querySelectorAll('.tutor-booksplash-course-item'), 'dataset')
      for course, i in MASTER_COURSES_LIST
        expect(MASTER_COURSES_LIST[i].name).to.contain(renderDataset[i].title)
      # no refresh button when load succeeds
      expect(state.div.querySelector(".refresh-button")).to.be.null

  it 'renders empty courses if course list only contains arhived course', ->
    CourseListingActions.loaded([STUDENT_ARCHIVED_COURSE])
    renderListing().then (state) ->
      expect(state.div.querySelector('.-course-list-empty')).not.to.be.null

  it 'renders course appropriate help', ->
    CourseListingActions.loaded(MASTER_COURSES_LIST)
    renderListing().then (state) ->
      # no courses are CC, so link should be tutor
      expect(state.div.querySelector('.-help-link a').getAttribute('href'))
        .equal(TUTOR_HELP)

    courses = _.clone(MASTER_COURSES_LIST)
    courses[0] = _.clone(MASTER_COURSES_LIST[0])
    courses[0].is_concept_coach = true
    CourseListingActions.loaded(courses)
    renderListing().then (state) ->
      # has at least one CC course, so link should be to CC
      expect(state.div.querySelector('.-help-link a').getAttribute('href'))
        .equal(CONCEPT_COACH_HELP)

  it 'displays refresh button when loading fails', ->
    CourseListingActions.FAILED()
    expect(CourseListingStore.isFailed()).to.be.true
    renderListing().then (state) ->
      expect(state.div.querySelector(".refresh-button")).not.to.be.null

  it 'redirects to teacher calendar with multiple course roles', ->
    CourseListingActions.loaded([TEACHER_AND_STUDENT_COURSE_THREE_MODEL])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, CourseCalendar))
        .to.have.length(1)


  it 'redirects to teacher calendar', ->
    CourseListingActions.loaded([TEACHER_COURSE_TWO_MODEL])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, CourseCalendar))
        .to.have.length(1)

  it 'redirects to student dashboard', ->
    CourseListingActions.loaded([STUDENT_COURSE_ONE_MODEL])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, StudentDashboardShell))
        .to.have.length(1)

  it 'redirects to student dashboard if student has two courses but one is archived', ->
    CourseListingActions.loaded([STUDENT_COURSE_ONE_MODEL, STUDENT_ARCHIVED_COURSE])
    renderListing().then (state) ->
      expect(state.listing).to.be.undefined # Won't have rendered the listing
      expect(ReactTestUtils.scryRenderedComponentsWithType(state.component, StudentDashboardShell))
        .to.have.length(1)

  it 'renders a "no membership" page when not a member of any courses', ->
    # clear all course stores
    CourseActions.reset()
    CourseListingActions.loaded([])
    renderListing().then (state) ->
      expect(state.div.textContent).to.include('We cannot find an OpenStax course associated with your account')


