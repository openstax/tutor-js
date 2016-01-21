selenium = require 'selenium-webdriver'


goBack = (test) ->
  test.driver.navigate().back()

goForward = (test) ->
  test.driver.navigate().forward()

refresh = (test) ->
  test.driver.navigate().refresh()

navigateTo = (test, url) ->
  test.driver.navigate().to(url)

goTo = (test, url) ->
  test.driver.get(url)

getTitle = (test) ->
  test.driver.getTitle()

getUrl = (test) ->
  test.driver.getCurrentUrl()

getPageSource = (test) ->
  test.driver.getPageSource()

close = (test) ->
  test.driver.close()

quit = (test) ->
  test.driver.quit()

acceptAlert = (test, alert) ->
  alert = test.driver.switchTo().alert()
  alert.accept()

dismissAlert = (test, alert) ->
  alert = test.driver.switchTo().alert()
  alert.dismiss()





module.exports = {goBack, goForward, refresh, navigateTo, goTo, 
getTitle, getUrl, getPageSource, close, quit, acceptAlert, dismissAlert}
