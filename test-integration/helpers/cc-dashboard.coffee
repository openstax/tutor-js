selenium = require 'selenium-webdriver'
{expect} = require 'chai'

CC_HELP_LINK = 'openstaxcc.zendesk.com/hc/en-us'

CCDashboard =
  verify: (test) ->
    test.waitAnd(css: '.cc-dashboard .dashboard')

  switchPeriods: (test) ->
    test.waitAnd(css: '.cc-dashboard .dashboard')

    test.waitClick(css: '.nav.nav-tabs li:not(.active) a')
    test.sleep(100) # wait for render to happen

  verifyPeriod: (test) ->
    dashboard = test.driver.findElement(css: '.dashboard')
    activeTab = test.driver.findElement(css: '.nav.nav-tabs li.active')

    dashboard.getAttribute('data-period').then (periodId) ->
      activeTab.getAttribute('data-reactid').then (reactId) ->
        expect(reactId.indexOf("period-nav-#{periodId}")).is.not.equal(-1)

  clickViewScores: (test) ->
    test.waitAnd(css: '.cc-dashboard .dashboard')
    test.waitClick(css: '.dashboard .detailed-scores.btn')

  verifyHelpLink: (test) ->
    helpLink = test.driver.findElement(css: 'li.-help-link > a')

    helpLink.getAttribute('href').then (href) ->
      expect(href.indexOf(CC_HELP_LINK)).is.not.equal(-1)

    helpLink.getAttribute('target').then (target) ->
      expect(target.toUpperCase().indexOf('_BLANK')).is.not.equal(-1)
  
module.exports = CCDashboard
