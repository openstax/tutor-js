windowPosition = (test) ->

  scrollTop: ->
    # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.driver.executeScript("window.scrollTo(0,0);")
    test.sleep(200)

  scrollTo: (el) =>
    test.driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.sleep(200)

module.exports = windowPosition
