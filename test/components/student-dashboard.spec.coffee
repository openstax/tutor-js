_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
{TimeActions}  = require '../../src/flux/time'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub}   = require './helpers/utilities'

{StudentDashboardShell} = require '../../src/components/student-dashboard'
{StudentDashboardStore, StudentDashboardActions} = require '../../src/flux/student-dashboard'

COURSE_ID = '1'
DATA = require "../../api/courses/1/dashboard.json"
NOW  = new Date("2015-04-13T14:15:58.856Z")
renderDashBoard = ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{COURSE_ID}/dashboard").then (result) ->
      resolve(_.extend({
        dashboard: ReactTestUtils.findRenderedComponentWithType(result.component, StudentDashboardShell)
      }, result))



describe 'Student Dashboard Component', ->
  beforeEach (done) ->
    TimeActions.setNow(NOW)
    StudentDashboardActions.reset()
    StudentDashboardActions.loaded(DATA, COURSE_ID)
    done()

  it 'displays the course title with teacher names combined', ->
    renderDashBoard().then (state) ->
      expect(state.div.querySelector('.course-title').innerText)
        .equal("Physics - Many Plan | Andrew Garcia & Bob Newhart")

      newData = _.clone(DATA)
      newData.course.teacher_names = ["Teacher Jill"]
      StudentDashboardActions.loaded(newData, COURSE_ID)
      state.dashboard.setState(courseId: COURSE_ID) # triggers re-rendering
      expect(state.div.querySelector('.course-title').innerText)
        .equal("Physics - Many Plan | Teacher Jill")


  it 'renders this week panel',  ->
    TimeActions.setNow(NOW)
    # Set the date to a known position so the panel contents can be calculated
    # 2015-04-13 is a Monday and the fixture data has:
    #  * one event that started on Sunday, the 12th. As spece'd that should not be included
    #  * one event that started at 8am, before the timestamp, but part of the week
    #  * one event a few days later
    #  * one event on the next sunday, the 19th.  As spece'd that should also be included
    renderDashBoard().then (state) ->
      tasks = state.div.querySelectorAll('.-this-week .task .title>span:first-child')
      expect(tasks.length).equal(3)
      expect(_.pluck(tasks, 'textContent'))
        .to.have.deep.equal([
          'iReading 2: Newton\'s First Law of Motion: Inertia'
          'iReading 3: Newton\'s Second Law of Motion:'
          'iReading 4: Newton\'s Third Law of Motion'
        ])

  it 'renders only upcoming events to week panel', ->
    TimeActions.setNow(new Date("2015-04-24T11:15:58.856Z"))
    renderDashBoard().then (state) ->
      tasks = state.div.querySelectorAll('.-upcoming .task .title>span:first-child')
      expect(_.pluck(tasks, 'textContent'))
        .to.have.deep.equal(['Homework #3', 'Homework #4 (final)'])

  it 'renders Dont Forget panel', ->
    # Time is set after all events have occured
    TimeActions.setNow(new Date("2015-06-01T14:15:58.856Z"))
    renderDashBoard().then (state) ->
      events = state.div.querySelectorAll('.dont-forget .panel-body .title')
      # For now all we're doing is rendering the 4 most recent past-due events
      expect(_.pluck(events, 'textContent'))
        .to.have.deep.equal([
          'Homework #1'
          'Homework #2'
          'Homework #3'
          'Homework #4 (final)'
        ])
      expect(state.div.querySelector('.dont-forget .panel-body>div').className)
        .include('col-xs-3')

  it 'renders only as many events as are available', ->
    # Time is set after only one event has occured
    TimeActions.setNow(new Date("2015-04-12T09:15:58.856Z"))
    renderDashBoard().then (state) ->
      events = state.div.querySelectorAll('.dont-forget .panel-body .title')
      # For now all we're doing is rendering the 4 most recent past-due events
      expect(_.pluck(events, 'textContent'))
        .to.have.deep.equal([
          'iReading 1: Force'
        ])
      expect(state.div.querySelector('.dont-forget .panel-body>div').className)
        .to.include('col-xs-12')
