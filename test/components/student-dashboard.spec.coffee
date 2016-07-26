_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
{TimeActions}  = require '../../src/flux/time'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'
{sinon}        = require './helpers/component-testing'

{StudentDashboardShell} = require '../../src/components/student-dashboard'
{StudentDashboardStore, StudentDashboardActions} = require '../../src/flux/student-dashboard'
{CourseListingActions, CourseListingStore} = require '../../src/flux/course-listing'
CountdownRedirect = require '../../src/components/countdown-redirect'

COURSE = require '../../api/user/courses/1.json'
{CourseActions, CourseStore} = require '../../src/flux/course'

{
  STUDENT_COURSE_ONE_MODEL
} = require '../courses-test-data'

COURSE_ID = '1'
DATA = require '../../api/courses/1/dashboard.json'
NOW  = new Date('2015-04-13T14:15:58.856Z')
renderDashBoard = (courseId = COURSE_ID) ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{courseId}/list").then (result) ->
      resolve(_.extend({
        dashboard: ReactTestUtils.findRenderedComponentWithType(result.component, StudentDashboardShell)
      }, result))

describe 'Student Dashboard Component', ->
  beforeEach ->
    TimeActions.setNow(NOW)
    StudentDashboardActions.reset()
    CourseActions.loaded(COURSE, COURSE_ID)
    StudentDashboardActions.HACK_DO_NOT_RELOAD(true)
    StudentDashboardActions.loaded(DATA, COURSE_ID)

  afterEach ->
    StudentDashboardActions.HACK_DO_NOT_RELOAD(false)
    # reset time to stop side effects in other tests
    TimeActions.setNow(new Date())

  it 'renders this week panel',  ->
    TimeActions.setNow(NOW)
    # Set the date to a known position so the panel contents can be calculated
    # 2015-04-13 is a Monday and the fixture data has:
    #  * one event that started on Sunday, the 12th. As spece'd that should not be included
    #  * one event that started at 8am, before the timestamp, but part of the week
    #  * one event a few days later
    #  * one event on the next sunday, the 19th.  As spece'd that should also be included
    renderDashBoard().then (state) ->
      tasks = state.div.querySelectorAll('.-this-week .task .title')
      expect(tasks.length).equal(3)
      expect(_.pluck(tasks, 'textContent'))
        .to.have.deep.equal([
          'iReading 2: Newton\'s First Law of Motion: Inertia'
          'iReading 3: Newton\'s Second Law of Motion:'
          'iReading 4: Newton\'s Third Law of Motion'
        ])


  it 'shows accurate feedback', ->
    TimeActions.setNow(NOW)
    renderDashBoard().then (state) ->
      feedback = state.div.querySelectorAll('.-this-week .task .feedback span')
      expect(_.pluck(feedback, 'textContent'))
        .to.have.deep.equal([
          'Complete', 'In progress', 'Not started'
        ])
      feedback = state.div.querySelectorAll('.-upcoming .task .feedback span')
      expect(_.pluck(feedback, 'textContent'))
        .to.have.deep.equal([
          '6/7 correct', '7/8 correct', '6/6 answered', '7/3 answered', '0/2 answered', 'Not started', 'Not started'
        ])

  it 'renders events to week panel', ->
    TimeActions.setNow(new Date('2015-04-24T11:15:58.856Z'))
    # this seems to be null sometimes, which causes the spec to blow up. Catch error early
    expect( CourseStore.get(COURSE_ID).book_id ).to.exist

    renderDashBoard().then (state) ->
      tasks = state.div.querySelectorAll('.-upcoming .task .title')
      expect(_.pluck(tasks, 'textContent')).to.have.deep.equal([
        'Homework #3',
        'Homework #4 (final)',
        'Chapter 6 Homework Before Due, no feedback',
        'Chapter 5 and Chapter 6 Reading',
        'Chapter 10 and Chapter 11 Reading, multi-part'
      ])

  it 'does not work unopened tasks', ->
    TimeActions.setNow(NOW)
    renderDashBoard().then (state) ->
      classes = _.map(state.div.querySelectorAll('.-upcoming .task'), (el) ->
        _.without(el.classList, 'task', 'row', 'homework', 'reading')
      )
      expect(classes)
        .to.have.deep.equal([['workable'], ['workable'], [], [], [], [], []])

  it 'displays redirect when a CC course', ->
    @course = _.clone(STUDENT_COURSE_ONE_MODEL)
    @course.is_concept_coach = true
    @course.webview_url = 'http://test.com/cc'
    CourseListingActions.loaded([@course])
    routerStub.goTo("/courses/#{STUDENT_COURSE_ONE_MODEL.id}/list").then (result) ->
      expect(
        ReactTestUtils.findRenderedComponentWithType(result.component, CountdownRedirect)
      ).to.exist
      expect(result.div.textContent).to.include('redirected to your Concept Coach textbook')
