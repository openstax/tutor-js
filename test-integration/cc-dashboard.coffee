Helpers = require './helpers'
{describe} = Helpers
{expect} = require 'chai'
_ = require 'underscore'

TEACHER_USERNAME = 'teacher01'
CC_HELP_LINK = 'http://openstax.force.com/support?l=en_US&c=Products%3AConcept_Coach'
TYPE = 'CONCEPT_COACH'
ROLE = 'teacher'


describe 'Concept Coach Dashboard', ->
  beforeEach ->
    @user = new Helpers.User(@)
    @courseSelect = new Helpers.CourseSelect(@)
    @conceptCoach = new Helpers.CCDashboard(@)
    @scores = new Helpers.Scores(@)

    @user.login(TEACHER_USERNAME)

  canGo = ->
    @courseSelect.canGoToType(TYPE, ROLE)

  go = ->
    @courseSelect.goToByType(TYPE, ROLE)
    @conceptCoach.waitUntilLoaded()

  @ccDashboardIt = _.partial @maybeIt, {maybe: canGo, beforeEach: go}

  @ccDashboardIt 'Can switch periods (readonly)', ->
    @conceptCoach.switchPeriods()

    @conceptCoach.getTabPeriod().then (periodId) =>
      @conceptCoach.getDashboardPeriod().then (reactId) ->
        expect(reactId.indexOf("period-nav-#{periodId}")).is.not.equal(-1)

  @ccDashboardIt 'Can go to detailed scores (readonly)', ->
    @conceptCoach.clickViewScores()
    @scores.waitUntilLoaded()

  @ccDashboardIt 'Can display correct help link (readonly)', ->
    # Go to the concept coach dashboard
    @user.openHamburgerMenu()
    @conceptCoach.getHelpLinkHref().then (href) ->
      expect(href.indexOf(CC_HELP_LINK)).is.not.equal(-1)

    @conceptCoach.getHelpLinkTarget().then (target) ->
      expect(target.toUpperCase().indexOf('_BLANK')).is.not.equal(-1)

  @ccDashboardIt 'Can go to assignment links (readonly)', ->
    @conceptCoach.clickViewAssignmentLinks()
