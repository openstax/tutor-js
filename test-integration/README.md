# Directory Structure Design

By keeping the integration tests in the same repo:

1. updates to class names or other DOM features can be easily renamed
2. developers are more likely to keep integration tests up-to-date
3. new tests written by QA benefit everyone

## Files match `src/components` dirs

Because integration tests can take a long time, the names of the coffee files match the path in `src/components`.
This way the paths of the diff'd files in a Pull Request define which Selenium tests need to run.
If a file changes and is not in this path then all tests will run.

By reducing the amount of tests to run coders are more likely to run the tests themselves.

## `helpers` dir

The names of these helpers provide the frequent actions on a screen.
Some examples of screens are: 'Performance Report', 'Calendar', 'Homework Builder'.
They loosely correspond to directories in `src/components` but should (with refactoring) match them better.

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
