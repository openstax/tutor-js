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

  switchPeriods: () ->
    @el.inactiveTab.get().click()

  getTabPeriod: () ->
    @el.dashboard.get().getAttribute('data-period')

  getDashboardPeriod: () ->
    @el.activeTab.get().getAttribute('data-reactid')

  clickViewScores: () ->
    @el.viewScoresButton.get().click()

  getHelpLink: () ->
    helpLink = @test.driver.findElement(COMMON_ELEMENTS.helpLink)

  getHelpLinkHref: () ->
    @getHelpLink().getAttribute('href')

  getHelpLinkTarget: () ->
    @getHelpLink().getAttribute('target')

module.exports = CCDashboard
