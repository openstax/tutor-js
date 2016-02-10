# elements common across different interfaces can go here.
{TestItemHelper} = require './test-element'

class PeriodReviewTab extends TestItemHelper
  constructor: (test) ->
    locator =
      css: '.panel .nav.nav-tabs li'
    super(test, locator)

module.exports = {PeriodReviewTab}
