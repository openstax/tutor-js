{describe, CourseSelect, User, CCDashboard, Scores} = require './helpers'
{expect} = require 'chai'

{ScoresHelper} = Scores

TEACHER_USERNAME = 'teacher01'
CC_HELP_LINK = 'openstaxcc.zendesk.com/hc/en-us'


describe 'Concept Coach Dashboard', ->
  beforeEach ->
    @user = new User(@)
    @courseSelect = new CourseSelect(@)
    @conceptCoach = new CCDashboard(@)
    @scores = new ScoresHelper(@)

    @user.login(TEACHER_USERNAME)
    @courseSelect.goTo('CONCEPT_COACH')

  @it 'Can switch periods (readonly)', ->
    @conceptCoach.switchPeriods(@)

    @conceptCoach.getTabPeriod().then (periodId) =>
      @conceptCoach.getDashboardPeriod().then (reactId) ->
        expect(reactId.indexOf("period-nav-#{periodId}")).is.not.equal(-1)

  @it 'Can go to detailed scores (readonly)', ->
    @conceptCoach.clickViewScores(@)
    @utils.wait.for(css: '.scores-report')
    @scores.waitUntilLoaded()

  @it 'Can display correct help link (readonly)', ->
    # Go to the concept coach dashboard
    @user.openHamburgerMenu()
    @conceptCoach.getHelpLinkHref().then (href) ->
      expect(href.indexOf(CC_HELP_LINK)).is.not.equal(-1)

    @conceptCoach.getHelpLinkTarget().then (target) ->
      expect(target.toUpperCase().indexOf('_BLANK')).is.not.equal(-1)
