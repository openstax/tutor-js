import {describe, CourseSelect, Calendar, ReadingBuilder, User, freshId} from './helpers';
import {expect} from 'chai';

const TEACHER_USERNAME = 'teacher01';

describe('Simple Draft Tests', function() {

  this.it('Shows Validation Error when saving a blank Reading, Homework, and External (idempotent)', async function() {
    this.addTimeout(30);

    const title = this.utils.getFreshId();
    var y = await new User(this, TEACHER_USERNAME).login()
    console.log('Done logging in. No need for promises');

    // Go to the 1st courses dashboard
    const courseSelect = new CourseSelect(this)
    var x = await courseSelect.goTo(this, 'ANY');
    console.log('Done selecting a course. No need for promises');
  });
});
