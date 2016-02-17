_ = require 'underscore'
{TestHelper} = require './test-element'
selenium = require 'selenium-webdriver'

COMMON_ELEMENTS =
  loginLink:
    linkText: 'Login'

  # When the screen is narrow the login button is not immediately visible. It is hidden under a dropdown
  smallScreenNavbarToggle:
    css: '.navbar-header .navbar-toggle'

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
    css: '.-hamburger-menu .dropdown-toggle'

  openHamburgerMenu:
    css: '.-hamburger-menu.open'

  logoutForm:
    css: '.-hamburger-menu .-logout-form'

  homeLink:
    css: '.navbar-brand'

  pageTitle:
    css: '.navbar-brand.active'

  courseListing:
    css: '.course-listing'

COMMON_ELEMENTS.eitherSignInElement =
  css: "#{COMMON_ELEMENTS.searchQuery.css}, #{COMMON_ELEMENTS.usernameInput.css}"

class User extends TestHelper
  constructor: (test) ->
    testElementLocator = 'body'
    super(test, testElementLocator, COMMON_ELEMENTS)

  isLocal: =>
    @el.eitherSignInElement.get()
    @el.searchQuery.isPresent()

  logInLocal: (username) =>
    # Login as local
    @el.searchQuery.get().sendKeys(username)
    @el.searchQuery.get().submit()
    @el.usernameLink(username).click()

  logInDeployed: (username, password = 'password') =>
    # Login as dev (using accounts)
    @el.usernameInput.get().sendKeys(username)
    @el.passworkInput.get().sendKeys(password)
    @el.loginSubmit.click()

  login: (username, password = 'password') =>
    @el.loginLink.isDisplayed().then (isDisplayed) =>
      unless isDisplayed
        @el.smallScreenNavbarToggle.click()
      @el.loginLink.click()

    @test.utils.windowPosition.setLarge()

    @isLocal().then (isLocal) =>
      if isLocal
        @logInLocal(username)
      else
        @logInDeployed(username, password)
    # Inject a little CSS to unfix the pesky fixed navbar
    @test.driver.executeScript ->
      hider = document.createElement('style')
      hider.textContent = '''
        .navbar-fixed-bottom, .navbar-fixed-top,
        .pinned-on .pinned-header,
        .pinned-footer {
          z-index: initial !important;
          position: initial !important;
        }

        body.pinned-shy .navbar-fixed-top, body.pinned-shy .pinned-header {
          transform: initial !important;
        }

        body { padding: 0; }
      '''
      document.head.appendChild(hider)


    # Wait until the page has loaded.
    # Going to the root URL while logged in will redirect to dashboard
    # which may redirect to the course page.
    @test.utils.verbose('Waiting until tutor-js page loads up')
    @test.driver.wait(selenium.until.elementLocated(css: '#react-root-container .-hamburger-menu'))


  isModalOpen: =>
    @el.modalClose.isPresent()

  _closeModal: =>
    @el.modalClose.click()

  closeModal: =>
    @isModalOpen().then (isOpen) =>
      if isOpen
        console.log 'There is an open dialog. Closing.'
        @_closeModal()

  canLogout: =>
    @test.utils.windowPosition.scrollTop()
    @el.userMenu.isPresent()

  _logout: =>
    @openHamburgerMenu()
    @el.logoutForm.get().submit()

  logout: =>
    @closeModal()

    @canLogout().then (canLogout) =>
      @_logout() if canLogout

  goHome: =>
    @test.utils.windowPosition.scrollTop()
    @el.homeLink.click()
    @test.utils.wait.for(@el.courseListing.getLocator())

  isHamburgerMenuOpen: =>
    @el.openHamburgerMenu.isPresent()

  toggleHamburgerMenu: =>
    @el.userMenu.click()

  openHamburgerMenu: =>
    @isHamburgerMenuOpen().then (isOpen) =>
      unless isOpen
        @toggleHamburgerMenu()

User.logout = (test) ->
  user = new User(test).logout()

module.exports = User
