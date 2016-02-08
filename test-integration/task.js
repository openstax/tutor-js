import {describe, CourseSelect, Task, User} from './helpers'
import {expect} from 'chai'
import _ from 'underscore'
import selenium from 'selenium-webdriver'

const {TaskHelper} = Task;

const STUDENT_USERNAME = 'student01';


describe('Student performing tasks', function() {

  beforeEach(async function(done) {
    this.user = new User(this);
    this.task = new TaskHelper(this);
    this.courseSelect = new CourseSelect(this);

    await this.user.login(STUDENT_USERNAME);

    await this.courseSelect.goTo('ANY')
    await this.utils.wait.click({css: '.workable.task'})
    await this.task.waitUntilLoaded()
    done()
  });


  this.it('Can continue and go to expected steps (readonly)', async function(done) {
    // demonstrating get in spec.
    await this.task.el.enabledContinueButton.get().click();
    await this.task.el.enabledContinueButton.get().click();
    // get multiple seems to not be working right now.
    // await this.task.getStepCrumbs(4).then (crumb) ->
    //   crumb.click()

    // Go back to the course selection
    await this.user.goHome();
    done();
  });

  this.it('Can continue (readonly)', async function(done) {
    await this.utils.verboseWrap("continuing", () => {return this.task.continue()});

    // Go back to the course selection
    await this.utils.verboseWrap("going home", () => {return this.user.goHome()});
    done();
  });
});
