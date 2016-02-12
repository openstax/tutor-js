import {describe, CourseSelect, Calendar, ReadingBuilder, User, freshId} from './helpers';
import {expect} from 'chai';

const TEACHER_USERNAME = 'teacher01';

describe('Simple Draft Tests', function() {

  this.it('Simply logs in and selects a course', async function() {
    this.addTimeout(30);

    const title = this.utils.getFreshId();
    var y = await new User(this).login(TEACHER_USERNAME)
    console.log('Done logging in. No need for promises');

    // Go to the 1st courses dashboard
    const courseSelect = new CourseSelect(this)
    var x = await courseSelect.goTo(this, 'ANY');
    console.log('Done selecting a course. No need for promises');
  });
});
