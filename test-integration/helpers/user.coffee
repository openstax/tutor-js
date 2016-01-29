_ = require 'underscore'
{TestHelper} = require './test-element'

COMMON_ELEMENTS =
  loginLink:
    linkText: 'Login'
  searchQuery:
    css: '#search_query'
  usernameLink: (username) ->
    linkText: username

  usernameInput:
    css: '#auth_key'
  passworkInput:
    css: '#password'
  loginSubmit:
    css: '.password-actions button.standard'

  modalClose:
    css: '.modal-dialog .modal-header .close'

  userMenu:
    css: '.-hamburger-menu'

  logoutForm:
    css: '.-hamburger-menu .-logout-form'

  homeLink:
    css: '.navbar-brand'

COMMON_ELEMENTS.eitherSignInElement =
  css: "#{COMMON_ELEMENTS.searchQuery.css}, #{COMMON_ELEMENTS.usernameInput.css}"

class User extends TestHelper
  constructor: (test, username, password = 'password') ->
    @username = username
    @password = password

    testElementLocator = 'body'
    super(test, testElementLocator, COMMON_ELEMENTS)

  isLocal: =>
    @el.eitherSignInElement.get()
    @el.searchQuery.isPresent()

  logInLocal: =>
    # Login as local
    @el.searchQuery.get().sendKeys(@username)
    @el.searchQuery.get().submit()
    @el.usernameLink.get(@username).click()

  logInDeployed: =>
    # Login as dev (using accounts)
    @el.usernameInput.get().sendKeys(@username)
    @el.passworkInput.get().sendKeys(@password)
    @el.loginSubmit.get().click()

  login: =>
    @el.loginLink.get().click()

    @isLocal().then (isLocal) =>
      if isLocal
        @logInLocal()
      else
        @logInDeployed()

  isModalOpen: =>
    @el.modalClose.isPresent()

  _closeModal: =>
    @el.modalClose.get().click()

  closeModal: =>
    @isModalOpen().then (isOpen) =>
      if isOpen
        console.log 'There is an open dialog. Closing.'
        @_closeModal()

  canLogout: =>
    @test.utils.windowPosition.scrollTop()
    @el.userMenu.isPresent()

  _logout: =>
    @el.userMenu.get().click()
    @el.logoutForm.get().submit()

  logout: =>
    @closeModal()

    @canLogout().then (canLogout) =>
      @_logout() if canLogout

  goHome: =>
    @test.utils.windowPosition.scrollTop()
    @el.homeLink.get().click()


User.logout = (test) ->
  user = new User(test).logout()

module.exports = User
