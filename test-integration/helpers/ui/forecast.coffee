selenium = require 'selenium-webdriver'
_ = require 'underscore'

{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  back:
    css: '.back'


# all convenience functions for helping with forecast tests will be seen here.
# TODO make a base student forecast helper, and extend for teacher class and teacher student views
class Forecast extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.performance-forecast'
    super(test, testElementLocator, COMMON_ELEMENTS)


module.exports = Forecast
