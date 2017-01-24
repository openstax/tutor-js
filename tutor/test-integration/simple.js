const Helpers = require './helpers';
const {describe} = Helpers;

var TEACHER_USERNAME = 'teacher01'

describe('Simple ES7 Calendar Test', function() {

  // This test should click on a teacher dashboard and, if it is `Biology I`,
  // should goToHome twice, and logging output as things are happening.
  this.it('Simply logs in and selects a course', async function() {
    this.user = new Helpers.User(this)
    this.courseSelect = new Helpers.CourseSelect(this)

    debugger // This line tells the debugger (using `npm run debug-integration`) to pause here

    await this.user.login(TEACHER_USERNAME)

    // Go to the dashboard for a course
    await this.courseSelect.goToByType('ANY')
    var pageTitle = await this.user.el.pageTitle.get().getText()

    debugger
    if (pageTitle === 'Biology I') {
      console.log('It is Biology I!!!')
      for (var i=0; i < 2; i++) {
        console.log('Going home ' + i)
        await this.user.goToHome()
      }
      console.log('The user is back on the home page')
    } else {
      console.log('It is not Biology I')
      await this.user.goToHome()
      console.log('The user is back on the home page')
    }
  }) // End test
}) // End describe
