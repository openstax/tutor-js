selenium = require 'selenium-webdriver'

class DOM
  constructor: (test) -> @test = test

  getParentOfEl: (currentElement) ->
    currentElement.findElement(selenium.By.xpath('..'))

  # TODO reduce the copy pasta between for and forMultiple
  getParent: (locator) =>
    locator = @test.utils.toLocator(locator)
    currentElement = @test.driver.findElement(locator)
    @getParentOfEl(currentElement)

dom = (test) ->
  return new DOM(test)

module.exports = dom
