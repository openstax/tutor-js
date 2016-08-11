_ = require 'underscore'
{TestHelper} = require './test-element'
selenium = require 'selenium-webdriver'

# Record code coverage before logging out
istanbul = require 'istanbul'
{mergeFileCoverage} = istanbul.utils

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
  passwordInput:
    css: '#password'
  loginSubmit:
    css: '.password-actions button[type="submit"]'

  modalClose:
    css: '.modal-dialog .modal-header .close'

  menu:
    css: '#react-root-container .-hamburger-menu'

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

  courseRosterLink:
    linkText: 'Course Roster'

COMMON_ELEMENTS.eitherSignInElement =
  css: "#{COMMON_ELEMENTS.searchQuery.css}, #{COMMON_ELEMENTS.usernameInput.css}"


# Record code coverage before logging out.
# Merges the coverage results from multiple tests
__coverage__ = {}
mergeCoverage = (obj) ->
  Object.keys(obj).forEach (filePath) ->
    original = __coverage__[filePath]
    added = obj[filePath]
    if original
      result = mergeFileCoverage(original, added)
    else
      result = added
    __coverage__[filePath] = result


class User extends TestHelper
  constructor: (test) ->
    testElementLocator =
      css: 'body'
    super(test, testElementLocator, COMMON_ELEMENTS)

  isLocal: =>
    @el.eitherSignInElement().get()
    @el.searchQuery().isPresent()

  logInLocal: (username) =>
    # Login as local
    @el.searchQuery().get().sendKeys(username)
    @el.searchQuery().get().submit()
    @el.usernameLink(username).waitClick()

  logInDeployed: (username, password = 'password') =>
    @test.utils.wait.giveTime (2 * 60 * 1000), =>
      # Login as dev (using accounts)
      @el.usernameInput().get().sendKeys(username)
      @el.passwordInput().get().sendKeys(password)
      @el.loginSubmit().click()

  login: (username, password = 'password') =>
    @el.loginLink().get().isDisplayed().then (isDisplayed) =>
      unless isDisplayed
        @el.smallScreenNavbarToggle().click()
      @el.loginLink().click()

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
        .pinned-on .pinned-header {
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
    @waitUntilLoaded()
    @el.menu().get()


  isModalOpen: =>
    @el.modalClose().isPresent()

  _closeModal: =>
    @el.modalClose().click()

  closeModal: =>
    @isModalOpen().then (isOpen) =>
      if isOpen
        console.log 'There is an open dialog. Closing.'
        @_closeModal()

  canLogout: =>
    @el.userMenu().isPresent()

  _logout: =>
    @openHamburgerMenu()

    # Pull out the coverage data
    @test.driver.executeScript("var c = window.__coverage__; delete window.__coverage__; return c;").then (results) ->
      mergeCoverage(results) if results

    @el.logoutForm().get().submit()

  logout: =>
    @closeModal()

    @canLogout().then (canLogout) =>
      @_logout() if canLogout

  goToHome: =>
    @el.homeLink().click()
    @el.courseListing().get()

  isHamburgerMenuOpen: =>
    @el.openHamburgerMenu().isPresent()

  toggleHamburgerMenu: =>
    @el.userMenu().click()

  openHamburgerMenu: =>
    @isHamburgerMenuOpen().then (isOpen) =>
      unless isOpen
        @toggleHamburgerMenu()

  # goToHome()
  # goToCourseHome()
  # goToDashboard()
  # goToForecast()
  # goToBook()
  # goToAccount()
  # goToHelp()
  # goToLogout()
  # openHamburgerMenu()
  # toggleHamburgerMenu()
  #
  # # Teacher-only:
  #
  # goToScores()
  goToRoster: =>
    @openHamburgerMenu()
    @el.courseRosterLink().waitClick()

User.getCoverageData = ->
  __coverage__

User.logout = (test) ->
  user = new User(test).logout()

module.exports = User
