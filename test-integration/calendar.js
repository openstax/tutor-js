import {describe, User, CourseSelect, Calendar, ReadingBuilder} from './helpers'
import {expect} from 'chai'
import _ from 'underscore'

const TEACHER_USERNAME = 'teacher01';
const {CalendarHelper} = Calendar;

// Quick test that nothing "blows up". For a more exhaustive version that clicks on all the items, see `./exhaustive`

describe('Calendar and Stats', function() {

  this.eachCourse = (msg, fn) => {
    _.each(['BIOLOGY', 'PHYSICS'], (courseCategory) => {
      this.it(`${msg} for ${courseCategory}`, async function(done) {
        await this.courseSelect.goTo(courseCategory)
        await this.calendar.waitUntilLoaded()
        await fn.call(this, courseCategory)
        // Go back to the course selection after the spec
        await this.user.goHome()
        done()
      });
    });
  }

  beforeEach(function() {
    this.user = new User(this)
    this.calendar = new CalendarHelper(this)
    this.courseSelect = new CourseSelect(this)

    this.user.login(TEACHER_USERNAME)
  });

  // These are commmented because they assume the existence of a plan to click on
  // this.eachCourse('Shows stats for a published plan (readonly)', async function(courseCategory) {
  //   const {publishedPlan, planPopup} = this.calendar.el;
  //   await publishedPlan.get().click();
  //   await planPopup.waitUntilLoaded();
  //   await planPopup.el.periodReviewTab.get().click();
  //   await planPopup.close();
  //   await this.calendar.waitUntilLoaded()
  // });
  //
  // this.eachCourse('Opens the review page for a visible plan (readonly)', async function(courseCategory) {
  //   const {publishedPlan, planPopup} = this.calendar.el;
  //   await publishedPlan.get().click();
  //   await planPopup.waitUntilLoaded();
  //
  //   await planPopup.goReview();
  //
  //   // TODO: review helper
  //   await this.utils.wait.for({css: '.task-teacher-review .task-breadcrumbs'});
  //   // Loop over each tab
  //   this.utils.forEach({css: '.panel .nav.nav-tabs li'}, (period) => period.click());
  //   // TODO: Better way of targeting the "Back" button
  //   // BUG: Back button goes back to course listing instead of calendar
  //   await this.driver.navigate().back();
  //
  //   await planPopup.waitUntilLoaded();
  //   await planPopup.close();
  //   await this.calendar.waitUntilLoaded();
  // });
  //

  this.eachCourse('Opens the learning guide (readonly)', async function(courseCategory) {
    await this.calendar.goPerformanceForecast();

    // TODO: guide helper.
    await this.utils.wait.for({css: '.guide-heading'});
    await this.utils.forEach({css: '.panel .nav.nav-tabs li'}, (period) => period.click());
    await this.utils.wait.click({css: '.back'});
  });



  this.eachCourse('Clicks an item in the Student Scores (readonly)', async function(courseCategory) {
    // The facebook table has some "fancy" elements that don't move when the table
    // scrolls vertically. Unfortunately, they cover the links.
    // There is a UI "border shadow" element that ends up going right
    // through the middle of a link. So, just hide the element
    this.addTimeoutMs(1000);
    await this.driver.executeScript(() => {
      var hider = document.createElement('style');
      hider.textContent = '.public_fixedDataTable_bottomShadow { display: none; }';
      document.head.appendChild(hider);
    });

    await this.calendar.goStudentScores()
    this.addTimeout(60)
    await this.utils.wait.for({css: '.scores-report .course-scores-title'})

    // Click the "Review" links (each task-plan)
    let item = await this.utils.wait.for({css: '.review-plan'});
    await item.click()
    await this.utils.wait.click({css: '.task-breadcrumbs > a'});
    await this.utils.wait.for({css: '.course-scores-wrap'});

    // Click each Student Forecast
    item = await this.utils.wait.for({css: '.student-name'});
    // console.log 'opening Student Forecast', courseCategory, index, 'of', total
    await item.click();
    await this.utils.wait.for({css: '.chapter-panel.weaker, .no-data-message'});
    await this.utils.wait.click({css: '.performance-forecast a.back'});
    await this.utils.wait.for({css: '.course-scores-wrap'});

    // only test the 1st row of each Student Response
    item = await this.utils.wait.for({css: '.fixedDataTableRowLayout_rowWrapper:nth-of-type(1) .task-result'});
    // console.log 'opening Student view', courseCategory, index, 'of', total
    await item.click();
    await this.utils.wait.for({css: '.async-button.continue'});
    // this.utils.wait.click(linkText: 'Back to Student Scores')
    await this.utils.wait.click({css: '.pinned-footer a.btn-default'});

    // // BUG: Click on "Period 1"
    // await this.utils.wait.click({css: '.course-scores-wrap li:first-child'})
    // await this.utils.wait.for({css: '.course-scores-wrap li:first-child [aria-selected="true"]'})
  });

});
