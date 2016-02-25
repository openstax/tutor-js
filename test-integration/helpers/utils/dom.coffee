selenium = require 'selenium-webdriver'

class DOM
  constructor: (test) -> @test = test

  _getParent: (currentElement) ->
    currentElement.findElement(selenium.By.xpath('..'))

  # TODO reduce the copy pasta between for and forMultiple
  getParent: (locator) =>
    locator = @test.utils.toLocator(locator)
    currentElement = @test.driver.findElement(locator)
    @_getParent(currentElement)

dom = (test) ->
  return new DOM(test)

module.exports = dom
