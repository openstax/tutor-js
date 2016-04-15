Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'Course Roster', ->

  @beforeEach ->
    @user = new Helpers.User(@)
    @calendar = new Helpers.Calendar(@)
    @roster = new Helpers.Roster(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goToByType('PHYSICS')
    @calendar.waitUntilLoaded()
    @roster.goToRoster()
    @roster.waitUntilLoaded()

  @it 'drops / undrops student', ->
    @roster.dropStudent()
    @roster.undropStudent()
