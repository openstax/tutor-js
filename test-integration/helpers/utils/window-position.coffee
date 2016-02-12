SIZE_PRESETS =
  LARGE: [1080, 1080]

windowPosition = (test) ->

  scrollTop: ->
    test.utils.verbose('Scrolling to top')
    # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.driver.executeScript("window.scrollTo(0,0);")
    test.sleep(200)

  scrollTo: (el) ->
    test.utils.verbose('Scrolling to el')
    test.driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.sleep(200)

  set: (args...) ->
    test.utils.verbose('Setting window size')
    test.driver.manage().window().setSize(args...)

  setLarge: ->
    test.utils.verbose('Setting large window size')
    test.driver.manage().window().setSize(SIZE_PRESETS.LARGE...)

module.exports = windowPosition
