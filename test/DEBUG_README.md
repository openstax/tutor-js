# Debugging TutorJS tests:

1. In tutor-js/ directory:
``` npm install karma-chrome-launcher/ ```
1. Update tutor-js/test/karma.config.coffee to use Chrome browser:
```# browsers: ['PhantomJS']
browsers: ['Chrome']```
1. Run gulp tdd
1. Set breakpoints as needed in Chrome instance that pops up

Notes:
1. Some tests seem to fail in the chrome instance, not sure why.  Will look into this
1. One very annoying thing is that it opens up a chrome instance every time you run the tests.  Will look into this as well.

