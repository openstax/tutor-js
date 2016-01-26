
selectReadings = (test, sections) ->
  test.waitAnd(css: '.select-reading-dialog:not(.hide)')
  # Make sure nav bar does not cover buttons
  test.scrollTop()

  # Expand the chapter and then select the section
  for section in sections
    do (section) =>
      section = "#{section}" # Ensure the section is a string so we can split it

      # Selecting an entire chapter requires clicking the input box
      # So handle chapters differently
      isChapter = not /\./.test(section)
      if isChapter
        test.waitClick(css: ".dialog:not(.hide) [data-chapter-section='#{section}'] .chapter-checkbox input")
      else
        # BUG? Hidden dialogs remain in the DOM. When searching make sure it is in a dialog that is not hidden
        test.driver.findElement(css: ".dialog:not(.hide) [data-chapter-section='#{section}']").isDisplayed().then (isDisplayed) =>
          # Expand the chapter accordion if necessary
          unless isDisplayed
            test.waitClick(css: ".dialog:not(.hide) [data-chapter-section='#{section.split('.')[0]}']")

          test.waitClick(css: ".dialog:not(.hide) [data-chapter-section='#{section}']")

module.exports = selectReadings
