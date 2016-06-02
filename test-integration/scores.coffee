Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'


describe 'HS Student Scores', ->

  @beforeEach ->
    @user = new Helpers.User(@)
    @calendar = new Helpers.Calendar(@)
    @scores = new Helpers.Scores(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goToByType('PHYSICS')
    @calendar.waitUntilLoaded()
    @calendar.goToScores()
    @scores.waitUntilLoaded()

  @it 'sorts by name or data', ->
    @scores.el.scoreCell().isPresent().then (isPresent) =>
      return console.log('Skipping because there are no assignments') unless isPresent

      @scores.el.nameHeaderSort().click()
      @scores.el.dataHeaderSort().click()
      @user.goToHome()

  @it 'changes periods', ->
    @scores.el.periodTab().click()
    @user.goToHome()

  @it 'generates export', ->
    @scores.el.generateExport().click()
    @scores.waitUntilDoneExporting()

    # Did export succeeed?
    @scores.isExportSucceeded().then (isExportSucceeded) =>
      console.log('exported:', isExportSucceeded)
      expect(isExportSucceeded).to.be.true

    # Is export downloaded?
    @scores.isExportDownloaded().then (isExportDownloaded) =>
      console.log('downloaded:', isExportDownloaded)
      expect(isExportDownloaded).to.be.true


describe 'CC Student Scores', ->

  beforeEach ->
    @user = new Helpers.User(@)
    @calendar = new Helpers.Calendar(@)
    @scores = new Helpers.Scores(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @conceptCoach = new Helpers.CCDashboard(@)
    @user.login(TEACHER_USERNAME)
    @courseSelect.goToByType('CONCEPT_COACH')
    @conceptCoach.waitUntilLoaded()
    @conceptCoach.goToScores()
    @scores.waitUntilLoaded()

  @it 'sorts by name or data', ->
    @scores.el.scoreCell().isPresent().then (isPresent) =>
      return console.log('Skipping because there are no assignments') unless isPresent

      @scores.el.nameHeaderSort().click()
      @scores.el.dataHeaderSort().click()
      @user.goToHome() # Because the logout from a CC page goes to cc.openstax, go home first so the logout goes to tutor.

  @it 'changes periods', ->
    @scores.el.periodTab().click()
    @user.goToHome()

  @it 'toggles display as', ->
    @scores.el.scoreCell().isPresent().then (isPresent) =>
      return console.log('Skipping because there are no assignments') unless isPresent

      @scores.el.scoreCell().get().getText().then (txt) ->
        expect(txt).to.contain('%')
      @scores.el.displayAs().click()
      @scores.el.scoreCell().get().getText().then (txt) ->
        expect(txt).to.contain('of')
      @user.goToHome()

  @it 'hovers tooltip info popover', ->
    @scores.getCCTooltip().getText().then (txt) ->
      expect(txt).to.contain('Completed')
      expect(txt).to.contain('questions')
      expect(txt).to.contain('Last Worked')

