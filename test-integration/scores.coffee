{describe, User, CourseSelect, Calendar, Scores} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{CalendarHelper} = Calendar
{ScoresHelper} = Scores


describe 'HS Student Scores', ->

  @beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('PHYSICS')
    @calendar.goStudentScores()

  @afterEach ->
    @user.goHome()


  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.click()
    @scores.el.dataHeaderSort.click()

  @it 'changes periods', ->
    @scores.el.periodTab.click()





describe 'CC Student Scores', ->

  @beforeEach ->
    @user = new User(@)
    @calendar = new CalendarHelper(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('CONCEPT_COACH')
    @scores.goCCScores()

  @afterEach ->
    @user.goHome()


  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.click()
    @scores.el.dataHeaderSort.click()

  @it 'changes periods', ->
    @scores.el.periodTab.click()

  @it 'toggles display as', ->
    @scores.el.scoreCell.get().getText().then (txt) ->
      expect(txt).to.contain('%')
    @scores.el.displayAs.click()
    @scores.el.scoreCell.get().getText().then (txt) ->
      expect(txt).to.contain('of')

  @it 'toggles based on', ->
    @scores.el.averageLabel.get().getText().then (txt) ->
      expect(txt).to.contain('possible')
    @scores.el.basedOn.click()
    @scores.el.averageLabel.get().getText().then (txt) ->
      expect(txt).to.contain('attempted')
