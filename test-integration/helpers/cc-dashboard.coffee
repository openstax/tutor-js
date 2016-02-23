selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  dashboard:
    css: '.dashboard'

  inactiveTab:
    css: '.nav.nav-tabs li:not(.active) a'

  activeTab:
    css: '.nav.nav-tabs li.active'

  viewScoresButton:
    css: '.detailed-scores.btn'

  helpLink:
    css: 'li.-help-link > a'

  scoresReport:
    css: '.scores-report'


class CCDashboard extends TestHelper

  constructor: (test, testElementLocator) ->
    testElementLocator ?= '.cc-dashboard'
    super(test, testElementLocator, COMMON_ELEMENTS)

  switchPeriods: ->
    @el.inactiveTab.click()

  getTabPeriod: ->
    @el.dashboard.get().getAttribute('data-period')

  getDashboardPeriod: ->
    @el.activeTab.get().getAttribute('data-reactid')

  clickViewScores: ->
    @el.viewScoresButton.click()

  getHelpLinkHref: ->
    @el.helpLink.get().getAttribute('href')

  getHelpLinkTarget: ->
    @el.helpLink.get().getAttribute('target')

  # goToScores()
  # goToBook()
  # selectPeriodByIndex(num)
  # selectPeriodByTitle(title)

module.exports = CCDashboard
