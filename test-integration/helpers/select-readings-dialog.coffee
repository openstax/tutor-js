{TestHelper} = require './test-element'

OPENED_PANEL_SELECTOR = '.dialog:not(.hide)'

COMMON_SELECT_READING_ELEMENTS =
  showProblemsBtn:
    css: '.homework-plan-exercise-select-topics button.-show-problems'

  sectionItem: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section}']"
  chapterHeadingSelectAll: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] .chapter-checkbox input"
  chapterHeading: (section) ->
    css: "#{OPENED_PANEL_SELECTOR} [data-chapter-section='#{section.split('.')[0]}'] > a"
  loadingLocator:
    css: '.loadable.is-loading'

  nextStepBtn:
    css: '.panel-footer .btn.btn-primary'

class SelectReadingsList extends TestHelper
  constructor: (test, testElementLocator) ->
    testElementLocator ?= css: ".select-reading-dialog#{OPENED_PANEL_SELECTOR}"
    super test, testElementLocator, COMMON_SELECT_READING_ELEMENTS

  selectSection: (section) =>
    # Selecting an entire chapter requires clicking the input box
    # So handle chapters differently
    isChapter = not /\./.test(section)
    if isChapter
      @el.chapterHeadingSelectAll(section).click()
    else
      # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
      @el.sectionItem(section).findElement().isDisplayed().then (isDisplayed) =>
        # Expand the chapter accordion if necessary
        unless isDisplayed
          @el.chapterHeading(section).click()

        @el.sectionItem(section).click()

  selectSections: (sections) =>
    # Expand the chapter and then select the section
    for section in sections
      do (section) =>
        section = "#{section}" # Ensure the section is a string so we can split it
        @selectSection(section)

  nextStep: ->
    @el.showProblemsBtn.click()

module.exports = SelectReadingsList
