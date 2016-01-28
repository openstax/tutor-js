wait = require './utils/wait'

class User
  constructor: (test, username, password = 'password') ->
    @test = test
    @username = username
    @password = password

  login: ->
    wait(@test).click(linkText: 'Login')

    # Decide if this is local or deployed
    wait(@test).for(css: '#auth_key, #search_query')

    @test.driver.isElementPresent(css: '#search_query').then (isPresent) =>
      if isPresent
        # Login as local
        @test.driver.findElement(css: '#search_query').sendKeys(@username)
        @test.driver.findElement(css: '#search_query').submit()
        wait(@test).click(linkText: @username)

      else
        # Login as dev (using accounts)
        @test.driver.findElement(css: '#auth_key').sendKeys(@username)
        @test.driver.findElement(css: '#password').sendKeys(@password)
        @test.driver.findElement(css: '.password-actions button.standard').click()

  # as a convenience logout can be called either as a static or instance method
  @logout: (test) ->
    # Close the modal if one is open
    test.driver.isElementPresent(css: '.modal-dialog .modal-header .close').then (isPresent) ->
      if isPresent
        # Close the modal
        console.log 'There is an open dialog. Closing it as part of logout'
        wait(test).click(css: '.modal-dialog .modal-header .close')

      # Push the Log out button (ref book does not have one)
      test.driver.isElementPresent(css: '.-hamburger-menu').then (isPresent) ->
        if isPresent
          wait(test).click(css: '.-hamburger-menu') # Expand the menu
          wait(test).for(css: '.-hamburger-menu .-logout-form').submit()

  logout: -> User.logout(@test)


module.exports = User
