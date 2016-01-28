import _ from 'underscore'
import windowPosition from './window-position'

// Useful for exhaustive testing like "Click all the links in the Student Scores"
// Takes 2 args plus one optional one
// - `options`: Either a string indicating the CSS selector or an object with the following:
//   - `css` : a string CSS locator
//   - `linkText`: a string linkText locator
//   - `ignoreLengthChange`: a boolean indicating that it is OK for the list of elements to change
//     - This is useful for the Student Scores whose table lazily adds student rows when scrolled
export function forEach(test, options, fn, fn2) {
  let locator;
  if (typeof options === 'string') {
    locator = {css: options};
  } else {
    const {css, linkText, ignoreLengthChange} = options;
    if (linkText) {
      locator = {linkText};
    } else if (css) {
      locator = {css};
    } else {
      throw new Error(`Unknown locator format. So far only linkText and css are recognized. ${options}`);
    }
  }
  // Need to query multiple times because we might have moved screens so els are stale
  test.driver.findElements(locator).then((els1) => {
    let index = 0;
    if (fn2) {
      return fn2(els1); // Allow for things like printing "Clicking on 20 drafts"
    }
    _.each(els1, (el) => {
      test.driver.findElements(locator).then((els) => {
        const el = els[index];
        if (els.length !== els1.length && !ignoreLengthChange) {
          throw new Error(`Length changed during foreach! before: ${els1.length} after: ${els.length}`);
        }
        index += 1;
        if (!el) {
          throw new Error(`Bug. Looks like an element disappeared! index=${index} before:${els1.length} after: ${els.length}`);
        }
        // scroll if the element is not visible
        el.isDisplayed().then((isDisplayed) => {
          if (!isDisplayed) {
            windowPosition(test).scrollTo(el);
          }
          fn.call(test, el, index, els1.length);
        });
      });
    });
  });

  // Why were these part of forEach ?
  // Verify React loaded
  // driver.wait selenium.until.elementLocated(css: '#react-root-container [data-reactid]')
  // injectErrorLogging()
}
