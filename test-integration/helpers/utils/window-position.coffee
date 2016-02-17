SIZE_PRESETS =
  LARGE: [1080, 1080]

windowPosition = (test) ->

  scrollTo: (el) ->
    test.utils.verbose('Scrolling to el')
    test.driver.executeScript("arguments[0].scrollIntoView(true);", el)
    test.utils.wait.until('Wait until scrolling completes', => el.isDisplayed())

  set: (args...) ->
    test.utils.verbose('Setting window size')
    test.driver.manage().window().setSize(args...)

  setLarge: ->
    test.utils.verbose('Setting large window size')
    test.driver.manage().window().setSize(SIZE_PRESETS.LARGE...)

module.exports = windowPosition
