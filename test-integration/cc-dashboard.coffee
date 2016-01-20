{describe, CourseSelect, CCDashboard} = require './helpers'
{expect} = require 'chai'

TEACHER_USERNAME = 'teacher01'


describe 'Concept Coach Dashboard', ->
  beforeEach ->
    @startDashboard = =>
      @addTimeout(30)

      @login(TEACHER_USERNAME)

      # Go to the concept coach dashboard
      CourseSelect.goTo(@, 'CONCEPT_COACH')

  @it 'Can switch periods', ->
    @startDashboard()
    CCDashboard.switchPeriods(@)
    CCDashboard.verifyPeriod(@)

  @it 'Can go to detailed scores', ->
    @startDashboard()
    CCDashboard.clickViewScores(@)
    @waitAnd(css: '.scores-report')

  @it 'Can display correct help link', ->
    @startDashboard()
    # Go to the concept coach dashboard
    CCDashboard.verifyHelpLink(@)
