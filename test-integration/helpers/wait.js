import selenium from 'selenium-webdriver'
import toLocator from './to-locator'
import windowPosition from './window-position'

export function wait(theTest) {

  const wait = {
    forMultiple: (locator, ms = 60 * 1000) => {
      locator = toLocator(locator);
      let start = null;
      let timeout = 0;
      // Enqueue the timeout to increase only once this starts
      theTest.driver.call(() => {
        start = Date.now();
        theTest.addTimeoutMs(ms);
      });
      theTest.driver.wait(selenium.until.elementsLocated(locator))
      .then((val) => {
        const end = Date.now();
        const spent = end - start;
        const diff = ms - spent;
        // console.log "Took #{spent / 1000}sec of #{ms / 1000}"
        if (spent > ms) {
          throw new Error(`BUG: Took longer than expected (${spent / 1000}). Expected ${ms / 1000} sec`);
        }
        theTest.addTimeoutMs(-diff);
        return val;
      });
      // Because of animations an element might be in the DOM but not visible
      const el = theTest.driver.findElements(locator);

      el.then((elements) => {
        return theTest.driver.wait(selenium.until.elementIsVisible(elements[0]));
      });
      return el;
    },

    // Waits for an element to be available and bumps up the timeout to be at least 60sec from now
    for: (locator, ms = 60 * 1000) => {
      locator = toLocator(locator);
      let start = null;
      let timeout = 0;
      // Enqueue the timeout to increase only once this starts
      theTest.driver.call(() => {
        start = Date.now();
        theTest.addTimeoutMs(ms);
      });
      theTest.driver.wait(selenium.until.elementsLocated(locator))
      .then((val) => {
        const end = Date.now();
        const spent = end - start;
        const diff = ms - spent;
        // console.log "Took #{spent / 1000}sec of #{ms / 1000}"
        if (spent > ms) {
          throw new Error(`BUG: Took longer than expected (${spent / 1000}). Expected ${ms / 1000} sec`);
        }
        theTest.addTimeoutMs(-diff);
        return val;
      });
      // Because of animations an element might be in the DOM but not visible
      const el = theTest.driver.findElement(locator);

      el.then((element) => {
        return theTest.driver.wait(selenium.until.elementIsVisible(element));
      });
      return el;
    },
    click: (locator, ms) => {
      // Scroll to the top so the navbar does not obstruct what we are clicking
      windowPosition(theTest).scrollTop();
      const el = wait.for(locator, ms);
      el.click();
      // return el to support chaining the promises
      return el;
    }
  };

  return wait;
}
