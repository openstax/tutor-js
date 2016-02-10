SIZE_PRESETS =
  LARGE: [1080, 1080]

windowPosition = (test) ->

  scrollTop: ->
    # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.driver.executeScript("window.scrollTo(0,0);")
    test.sleep(200)

  scrollTo: (el) ->
    test.driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.sleep(200)

  set: (args...) ->
    test.driver.manage().window().setSize(args...)

  setLarge: ->
    test.driver.manage().window().setSize(SIZE_PRESETS.LARGE...)

module.exports = windowPosition
