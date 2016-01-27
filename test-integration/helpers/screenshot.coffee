selenium = require 'selenium-webdriver'
fs = require 'fs'

# Helper for saving screenshots
module.exports = (driver, filename) ->
  fn = (data) ->
    base64Data = data.replace(/^data:image\/png;base64,/, "")

    # Make sure the screenshot returns a promise
    new selenium.promise.Promise (resolve, reject) ->
      fs.writeFile "#{filename}.png", base64Data, 'base64', (err) ->
        if err
          reject(err)
        else
          resolve(true)

  driver.takeScreenshot().then(fn)
