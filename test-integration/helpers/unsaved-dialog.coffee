{TestHelper} = require './test-element'

COMMON_UNSAVED_DIALOG_ELEMENTS =
  dismissButton:
    css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn'


# TODO could probably make this a general dialog/modal helper to extend from.
class UnsavedDialog extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: '.tutor-dialog.modal'
    super test, testElementLocator, COMMON_UNSAVED_DIALOG_ELEMENTS, loadingLocator: css: '.tutor-dialog.modal.fade:not(.in)'

  waitUntilClose: =>
    @test.driver.wait =>
      @isPresent().then (isPresent) -> not isPresent

  close: =>
    @isPresent().then (modalIsOpened) =>
      return unless modalIsOpened

      @waitUntilLoaded()
      @el.dismissButton.click()
      @waitUntilClose()


module.exports = UnsavedDialog
