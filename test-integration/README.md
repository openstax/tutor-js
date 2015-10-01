# Setup
------

To run some selenium tests that create an iReading and saves a screenshot on failure.

Instructions

1. Clone the `tutor-js` repo and change into the `tutor-js/` directory
2. `npm install` (to get the current packages and versions)
3. `npm run integration-test` to run all the tests

## Running a subset of tests

To run a subset of tests you will need run the following line:

```sh
PATH=$PATH:./node_modules/.bin ./node_modules/.bin/mocha -R spec ./test-integration/task-plan/draft.coffee --compilers coffee:coffee-script/register
```

The parts are described below:

1. `PATH=$PATH:./node_modules/.bin`: lets Selenium know where to find the `chromedriver`
2. `./node_modules/.bin/mocha`: use the locally installed `mocha` You could do `npm install -g mocha` to simplify this line
3. `-R spec`: use the `spec` reporter (prints the name of the test being run instead of just a `.`)
4. `./test-integration/task-plan/draft.coffee`: which suite to run
5. `--compilers coffee:coffee-script/register`: teach mocha know how read coffeescript


## Testing a remote server

To test a specific server, set the `SERVER_URL` environment variable prior to running `mocha`:

    env SERVER_URL='tutor-XXX.openstax.org'

if `SERVER_URL` is not set, the tests will target the local Tutor instance (http://localhost:3001/)

# Directory Structure Design
----------------------------

By keeping the integration tests in the same repo:

1. updates to class names or other DOM features can be easily renamed
2. developers are more likely to keep integration tests up-to-date
3. new tests written by QA benefit everyone

## Files match [../src/components](../src/components) dirs

Because integration tests can take a long time, the names of the coffee files match the path in [../src/components](../src/components).
This way the paths of the diff'd files in a Pull Request define which Selenium tests need to run.
If a file changes and is not in this path then all tests will run.

By reducing the amount of tests to run coders are more likely to run the tests themselves.

## [./helpers](./helpers) dir

The names of these helpers provide the frequent actions on a screen.
Some examples of screens are: 'Student Scores', 'Calendar', 'Homework Builder'.
They loosely correspond to directories in [../src/components](../src/components) but should (with refactoring) match them better.

Frequently, integration tests require setting up some data which requires going through
several screens before the actual testing occurs.
The files in this directory make that process easier.
Also, by reusing these helpers, when a feature changes behavior it is easier than hunting
through each test and updating 1-by-1.

For example, to verify validation messages in the Homework Builder the test first needs to:

1. Log in
2. Choose a course
3. Click "Add new Homework" from the Calendar

So, the test would look something like:

```coffee
App.login(TEACHER_USERNAME)
CourseSelect.goTo('ANY')            # Choose any course
Calendar.createNew('HOMEWORK')
ReadingBuilder.edit(action: 'SAVE') # Try to save

(validation tests would go here)
```


# Notes

## Python notes

[./helpers/declare.coffee](./helpers/declare.coffee) contains several helper functions that encapsulate multiple selenium actions and would probably need to be ported to python. It also contains some bits that are specific to mocha, the JavaScript test runner and could be ignored.

[./helpers/reading-builder.coffee](./helpers/reading-builder.coffee) contains a few utility functions that would also need to be translated to python.

I'm guessing the tests themselves would be pretty linear in both cases (JavaScript or Python) assuming the helpers are written well.

If it is useful to reduce turnaround time by having FE run/update selenium tests (I'd like to be able to run them when reviewing Pull Requests) then it might make sense to have them in the same repo (see above in this doc).

## General CoffeeScript notes

- after a selenium action you can add `.then -> console.log 'some logging text'` to print when an action finishes
- or just put `.then -> console.log('...')` on a new line after the call
- use `@addTimeout(ms)` (preferably in helpers) to extend the time before failing the test

## Regarding JavaScript vs CoffeeScript

- CoffeeScript is syntactically heavily inspired by Ruby/Python
- Except for BigLearn, all tutor code is Ruby or CoffeeScript


### JavaScript has many more braces

- more `function() { ... }` boilerplate instead of `-> ...`
- `function(_this) { ... } (this)` for proper scoping instead of `=> ...` (see `helpers/describe`)
- being judicious about `return` everywhere for chaining (see `helpers/calendar`)

Example from [./helpers/describe.coffee](./helpers/describe.coffee):

```js
this.scrollTop = (function(_this) {
  return function() {
    _this.driver.executeScript("window.scrollTo(0,0);");
    return _this.sleep(200);
  };
})(this);
```

#### Coffee Version

```coffee
@scrollTop = () =>
  @driver.executeScript("window.scrollTo(0,0);")
  @sleep(200)
```

Example for adding logging after an action:

```js
this.waitClick('.button').then(function() { console.log('debugging println'); })
```

```coffee
@waitclick('.button').then -> console.log('debuggin println')
```

### When including multiple objects/functions while importing a package (semi-contrived):

Example from [./task-plan/draft.coffee](./task-plan/draft.coffee)

```js
var helpers = require('../helpers');
var describe = helpers.describe;
var CourseSelect = helpers.CourseSelect;
var Calendar = helpers.Calendar;
var ReadingBuilder = helpers.ReadingBuilder;
```

#### Coffee version

```coffee
{describe, CourseSelect, Calendar, ReadingBuilder} = require '../helpers'
```



### But the tests themselves should be pretty linear (assuming the helpers are written nicely):

Example from [./task-plan/draft.coffee](./task-plan/draft.coffee):

```js
describe('Draft Tests', function() {

  this.it('Creates a draft Reading with opensAt to today and deletes (idempotent)', function() {
    this.addTimeout(60);

    var title = this.freshId();

    this.login(TEACHER_USERNAME);

    // Go to the 1st courses dashboard
    CourseSelect.goTo(this, 'ANY');

    // Click to add a reading
    Calendar.createNew(this, 'READING');

    ReadingBuilder.edit(this, {
      name: title,
      // opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST',
      sections: [1.1, 1.2, 2.1, 3, 3.1],
      action: 'SAVE'
    });

    // Wait until the Calendar loads back up
    // And then verify it was added by clicking on it again
    // BUG: .course-list shouldn't be in the DOM
    Calendar.goOpen(this, title);

    ReadingBuilder.edit(this, {
      action: 'DELETE'
    });

    // Just verify we got back to the calendar
    Calendar.verify(this);
  });
});
```

#### Coffee Version

```coffee
describe 'Draft Tests', ->

  @it 'Creates a draft Reading with opensAt to today and deletes (idempotent)', ->
    @addTimeout(60)

    title = @freshId()

    @login(TEACHER_USERNAME)

    # Go to the 1st courses dashboard
    CourseSelect.goTo(@, 'ANY')

    # Click to add a reading
    Calendar.createNew(@, 'READING')

    ReadingBuilder.edit @,
      name: title
      # opensAt: 'NOT_TODAY'
      dueAt: 'EARLIEST'
      sections: [1.1, 1.2, 2.1, 3, 3.1]
      action: 'SAVE'

    # Wait until the Calendar loads back up
    # And then verify it was added by clicking on it again
    # BUG: .course-list shouldn't be in the DOM
    Calendar.goOpen(@, title)

    ReadingBuilder.edit(@, action: 'DELETE')

    # Just verify we get back to the calendar
    Calendar.verify(@)
```
