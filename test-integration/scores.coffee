{describe, User, CourseSelect, Calendar, Scores} = require './helpers'
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'

{ScoresHelper} = Scores


describe 'HS Student Scores', ->

  @beforeEach ->
    @user = new User(@)
    @calendar = new Calendar(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('PHYSICS')
    @calendar.goStudentScores()
    @scores.waitUntilLoaded()

  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.get().click() # If you use just `.click()` that will scroll to try to make the element visible but cause the next element to not be clickable
    @scores.el.dataHeaderSort.click()
    @user.goHome()

  @it 'changes periods', ->
    @scores.el.periodTab.click()
    @user.goHome()





describe 'CC Student Scores', ->

  beforeEach ->
    @user = new User(@)
    @calendar = new Calendar(@)
    @scores = new ScoresHelper(@)
    @courseSelect = new CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('CONCEPT_COACH')
    @scores.goCCScores()

  @it 'sorts by name or data', ->
    @scores.el.nameHeaderSort.get().click() # If you use just `.click()` that will scroll to try to make the element visible but cause the next element to not be clickable
    @scores.el.dataHeaderSort.click()
    @user.goHome() # Because the logout from a CC page goes to cc.openstax, go home first so the logout goes to tutor.

  @it 'changes periods', ->
    @scores.el.periodTab.click()
    @user.goHome() # Because the logout from a CC page goes to cc.openstax, go home first so the logout goes to tutor.

  @it 'toggles display as', ->
    @scores.el.scoreCell.isPresent().then (isPresent) =>
      return console.log('Skipping because there are no assignments') unless isPresent

      @scores.el.scoreCell.get().getText().then (txt) ->
        expect(txt).to.contain('%')
      @scores.el.displayAs.click()
      @scores.el.scoreCell.get().getText().then (txt) ->
        expect(txt).to.contain('of')
      @user.goHome() # Because the logout from a CC page goes to cc.openstax, go home first so the logout goes to tutor.
