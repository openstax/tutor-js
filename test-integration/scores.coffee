{describe, User, CourseSelect, Calendar, Scores} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} = Calendar
{ScoresHelper} = Scores


describe 'HS Student Scores', ->

  beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goToCourseByName('Physics I')
    @calendar.goStudentScores()

  afterEach ->
    @user.goHome()


  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.get().click()
    @scores.el.dataHeaderSort.get().click()

  @it 'changes periods', ->
    @scores.el.periodTab.get().click()





describe 'CC Student Scores', ->

  beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goToCourseByName('Concept Coach')
    @scores.goCCScores()

  afterEach ->
    @user.goHome()


  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.get().click()
    @scores.el.dataHeaderSort.get().click()

  @it 'changes periods', ->
    @scores.el.periodTab.get().click()

  @it 'toggles display as', ->
    @scores.el.scoreCell.get().getText().then (txt) ->
      expect(txt).to.contain('%')
    @scores.el.displayAs.get().click()
    @scores.el.scoreCell.get().getText().then (txt) ->
      expect(txt).to.contain('of')

  @it 'toggles based on', ->
    @scores.el.averageLabel.get().getText().then (txt) ->
      expect(txt).to.contain('possible')
    @scores.el.basedOn.get().click()
    @scores.el.averageLabel.get().getText().then (txt) ->
      expect(txt).to.contain('attempted')

    
