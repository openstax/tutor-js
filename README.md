[![Build Status](https://github.com/openstax/tutor-js/workflows/Build/badge.svg)](https://github.com/openstax/tutor-js)
[![Test Status](https://github.com/openstax/tutor-js/workflows/TutorJS/badge.svg)](https://github.com/openstax/tutor-js)

# TutorJS

The Front-end code for Openstax Tutor related projects

## Install

1. install [nvm](https://github.com/creationix/nvm)
  - run `nvm install` in this directory to install and use the correct version of node
  - _Alternatively:_ manually install the right version of node in [./.nvmrc](./.nvmrc)
1. Git Clone this repository to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js` move into the checked out directory
1. `yarn install`
1. `yarn run serve <project>` *(where <project is one of tutor|exercises)*

 - Run the Tutor server as shown below

## Development

- `yarn run serve <project>` starts up a local development webserver which rebuilds files when changed.
- `yarn test <project>` runs unit tests for all projects
- `yarn run coverage` generates a code coverage report
- `yarn run build <project> archive` builds minified files for production
- `yarn run test e2e` run the integration tests using playwright test runner.

#### e2e test failures 

To debug e2e failures, you can run in debug mode by adding the `--debug` flag.  For instance to debug a failure with the course roster spec, you could run: `yarn run test e2e --debug roster`.  `--debug` disables timeouts and is useful in conjuction with adding strategic `page.pause()` calls in the spec.  The brower will then open and pause at that step, allowing you to open the browser console and inspect it's state.

On Github actions you can download the "test-result" artifacts.  Each test failure will generate a screenshot and a trace file.  The trace file can be viewed by: `yarn run playwright show-trace <path to trace file>` The viewer allows you to view the browser screen and dev console for each test step.

There is also a [retries configration](https://playwright.dev/docs/test-retries) that can be adjusted if some specs are inherently flaky. 

After local updates are made:

1. stop `yarn start`
1. `yarn install`
1. restart `yarn start`

#### Playwright tests

Tutor uses [playwright](http://playwright.dev) for acceptance testing.  The tests can be ran by:
1. start the stubbed backend server: `yarn run tutor:test:server`
1. run the e2e test suite: `yarn run tutor:test:e2e`

### Tutor Server

Using the sample API data only allows acting as a student and can't save data.  For a more realistic development experience you'll also need to run the [Tutor server](https://github.com/openstax/tutor-server)

1. Install Tutor Server as shown in its README file
1. Start both the tutor-server Rails application and run `yarn run serve tutor` in this project's directory
1. Load <http://localhost:3001> in your browser
  - Once you click login, the server will present a dev console that allows you to select a user
1. And will then render the FE just as it appears in production

### Exercises

`tutor-js` is also the front-end for [Exercises](https://github.com/openstax/exercises) and is ran similarly to the Tutor Server.

1. Install OpenStax Exercises as shown in its README file
1. Run `yarn run serve exercises` in `tutor-js` directory
1. Load <http://localhost:3000> in your browser

[travis-image]: https://img.shields.io/travis/openstax/tutor-js/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/openstax/tutor-js
[dependency-image]: https://img.shields.io/david/openstax/tutor-js.svg?style=flat-square
[dependency-url]: https://david-dm.org/openstax/tutor-js
[dev-dependency-image]: https://img.shields.io/david/dev/openstax/tutor-js.svg?style=flat-square
[dev-dependency-url]: https://david-dm.org/openstax/tutor-js#info=devDependencies
[codecov-image]: https://img.shields.io/codecov/c/github/openstax/tutor-js.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/openstax/tutor-js
