windowPosition = (driver) ->

  scrollTop: ->
    # @driver.executeScript("arguments[0].scrollIntoView(true);", el)
    driver.executeScript("window.scrollTo(0,0);")
    @sleep(200)

  scrollTo: (el) =>
    driver.executeScript("arguments[0].scrollIntoView(true);", el)
    @sleep(200)
