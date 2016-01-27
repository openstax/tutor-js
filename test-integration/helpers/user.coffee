wait = require './wait'

class User
  constructor: (driver, username, password = 'password') ->
    @driver = driver
    @username = username
    @password = password

  login: ->
    wait(@driver).click(linkText: 'Login')

    # Decide if this is local or deployed
    wait(@driver).and(css: '#auth_key, #search_query')

    @driver.isElementPresent(css: '#search_query').then (isPresent) =>
      if isPresent
        # Login as local
        @driver.findElement(css: '#search_query').sendKeys(username)
        @driver.findElement(css: '#search_query').submit()

        wait(@driver).click(linkText: username)

      else
        # Login as dev (using accounts)
        @driver.findElement(css: '#auth_key').sendKeys(username)
        @driver.findElement(css: '#password').sendKeys(password)
        @driver.findElement(css: '.password-actions button.standard').click()

  # as a convenience logout can be called either as a static or instance method
  @logout: (driver) ->
    # Close the modal if one is open
    driver.isElementPresent(css: '.modal-dialog .modal-header .close').then (isPresent) =>
      if isPresent
        # Close the modal
        console.log 'There is an open dialog. Closing it as part of logout'
        wait(@driver).click(css: '.modal-dialog .modal-header .close')

      # Push the Log out button (ref book does not have one)
      driver.isElementPresent(css: '.-hamburger-menu').then (isPresent) =>
        if isPresent
          wait(@driver).click(css: '.-hamburger-menu') # Expand the menu
          wait(@driver).and(css: '.-hamburger-menu .-logout-form').submit()

  logout: -> User.logout(@driver)


module.exports = User
