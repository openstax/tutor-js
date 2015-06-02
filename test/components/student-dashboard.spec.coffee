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
DATA = require '../../api/courses/1/dashboard.json'
NOW  = new Date('2015-04-13T14:15:58.856Z')
renderDashBoard = ->
  new Promise (resolve, reject) ->
    routerStub.goTo("/courses/#{COURSE_ID}/list").then (result) ->
      resolve(_.extend({
        dashboard: ReactTestUtils.findRenderedComponentWithType(result.component, StudentDashboardShell)
      }, result))

describe 'Student Dashboard Component', ->
  beforeEach ->
    TimeActions.setNow(NOW)
    StudentDashboardActions.reset()
    StudentDashboardActions.HACK_DO_NOT_RELOAD(true)
    StudentDashboardActions.loaded(DATA, COURSE_ID)

  afterEach ->
    StudentDashboardActions.HACK_DO_NOT_RELOAD(false)

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
      feedback = state.div.querySelectorAll('.-this-week .task .feedback')
      console.log _.pluck(feedback, 'textContent')
      expect(_.pluck(feedback, 'textContent'))
        .to.have.deep.equal([
          'Complete', 'In progress', 'Not started'
        ])

      feedback = state.div.querySelectorAll('.-upcoming .task .feedback')
      console.log _.pluck(feedback, 'textContent')
      expect(_.pluck(feedback, 'textContent'))
        .to.have.deep.equal(['6/7 correct', '7/8 correct', '6/6 answered', '7/3 answered'])


  it 'renders only upcoming events to week panel', ->
    TimeActions.setNow(new Date('2015-04-24T11:15:58.856Z'))
    renderDashBoard().then (state) ->
      tasks = state.div.querySelectorAll('.-upcoming .task .title')
      expect(_.pluck(tasks, 'textContent'))
        .to.have.deep.equal(['Homework #3', 'Homework #4 (final)'])
