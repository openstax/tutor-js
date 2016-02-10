OPENED_PANEL_SELECTOR = '.dialog:not(.hide)'

COMMON_SELECT_READING_ELEMENTS =
  sectionItem: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section}']"
  chapterHeadingSelectAll: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] .chapter-checkbox input"
  chapterHeading: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}']"


COMMON_UNSAVED_DIALOG_ELEMENTS =
  dismissButton:
    css: '.-tutor-dialog-parent .tutor-dialog.modal.fade.in .modal-footer .ok.btn'


class SelectReadingsList extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: ".select-reading-dialog#{OPENED_PANEL_SELECTOR}"
    super test, testElementLocator, COMMON_SELECT_READING_ELEMENTS, loadingLocator: css: '.select-reading-dialog.hide'

  selectSection: (section) =>
    # Selecting an entire chapter requires clicking the input box
    # So handle chapters differently
    isChapter = not /\./.test(section)
    if isChapter
      @el.chapterHeadingSelectAll.click(section)
    else
      # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
      @el.sectionItem.findElement(section).isDisplayed().then (isDisplayed) =>
        # Expand the chapter accordion if necessary
        unless isDisplayed
          @el.chapterHeading.click(section)

        @el.sectionItem.click(section)

  selectSections: (sections)
    # Expand the chapter and then select the section
    for section in sections
      do (section) =>
        section = "#{section}" # Ensure the section is a string so we can split it
        @selectSection(section)


module.exports = SelectReadingsList
