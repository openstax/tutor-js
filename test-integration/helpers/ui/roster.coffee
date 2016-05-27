selenium = require 'selenium-webdriver'
{TestHelper} = require './test-element'
_ = require 'underscore'

COMMON_ELEMENTS =
  editPeriodLinks:
    css: '.edit-period'
  studentEditLinks:
    css: '.actions a'
  periodLinkByName: (name) ->
    linkText: name
  rosterRows:
    css: '.roster tbody tr'
  rosterRowsNoActions:
    css: '.roster tbody tr td:not(.actions)'
  addLink:
    linkText: 'Add Period'
  deleteLink:
    linkText: 'Delete Period'
  changeLink:
    linkText: 'Change Period'
  editCourseLink:
    css: '.edit-course'
  navbarLink:
    css: '.navbar a.dropdown-toggle'
  rosterLink:
    css: '.navbar .dropdown-menu li:nth-child(5) a'
  dropPopover:
    css: '.period .roster tbody tr .actions a:nth-child(2)'
  dropStudent:
    css: '.-drop-student'
  undropPopover:
    css: '.dropped-students .roster tbody tr .actions a'
  undropStudent:
    css: '.-undrop-student'

COMMON_POPUP_ELEMENTS =
  closeButton:
    css: '.modal-header .close'
  content:
    css: '.modal-body.teacher-edit-period-form'
  warning:
    css: '.modal-body.teacher-edit-period-form .warning'
  nameInput:
    css: '.modal-body.teacher-edit-period-form .tutor-input input[type=text]'
  saveUpdate:
    css: '.modal-footer .-edit-period-confirm'
  base:
    css: '.teacher-edit-period-modal'

class PeriodEditModal extends TestHelper
  constructor: (test, testElementLocator) ->

    testElementLocator ?=
      css: '.teacher-edit-period-modal.modal.fade.in'
    super(test, testElementLocator, COMMON_POPUP_ELEMENTS)

  waitUntilClose: =>
    # waits until the locator element is not present
    @test.driver.wait =>
      @el.base().isPresent().then (isPresent) ->
        not isPresent

  close: =>
    @waitUntilLoaded()
    @el.closeButton().click()
    @waitUntilClose()

  addPeriodWithName: (name) =>
    @waitUntilLoaded()
    @el.nameInput().findElement().sendKeys(name)
    @el.saveUpdate().click()
    @waitUntilClose()

  renamePeriodWithName: (name) =>
    @waitUntilLoaded()
    @el.nameInput().findElement().sendKeys(name)
    @el.saveUpdate().click()
    @waitUntilClose()

  deleteEmptyPeriod: =>
    @waitUntilLoaded()
    @el.saveUpdate().click()
    @waitUntilClose()

  checkIsDeleteWarned: =>
    @waitUntilLoaded()
    @el.warning().isPresent()


class Roster extends TestHelper
  @PeriodEditModal: PeriodEditModal

  constructor: (test, testElementLocator, isCoach = false) ->
    testElementLocator ?=
      css: '.course-settings'

    super(test, testElementLocator, COMMON_ELEMENTS)

  getPeriodTypeFromEditLinks: =>
    @el.editPeriodLinks().findElements().getText()

  goToRoster: =>
    @el.navbarLink().click()
    @el.rosterLink().waitClick()

  dropStudent: =>
    @el.dropPopover().click()
    @el.dropStudent().waitClick()

  undropStudent: =>
    @el.undropPopover().waitClick()
    @el.undropStudent().waitClick()

module.exports = Roster
