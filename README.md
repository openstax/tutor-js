# tutor-js
[![build status][travis-image]][travis-url]
[![Coverage][codecov-image]][codecov-url]
[![dependency status][dependency-image]][dependency-url]
[![dev dependency status][dev-dependency-image]][dev-dependency-url]

The Front-end code for Openstax Tutor related projects

## Install

1. install [nvm](https://github.com/creationix/nvm)
  - run `nvm install` in this directory to install and use the correct version of node
  - _Alternatively:_ manualy install the right version of node in [./.nvmrc](./.nvmrc)
1. `npm install -g gulp` to install [gulp](http://gulpjs.com) globally
1. Git Clone this repository to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js` move into the checked out directory
1. `npm install`
1. `npm run serve <project>` *(where <project is one of tutor|coach|exercises)*
1. Point your browser to <http://localhost:8000> to use the mock data in `/api`


## Development

- `npm run serve <project>` starts up a local development webserver which rebuilds files when changed
- `npm test` runs unit tests for all projects
- `npm run coverage` generates a code coverage report
- `npm run build <project> archive` builds minified files for production

Use `PORT=8000 npm start` to change the default webserver port.

After local updates are made:

1. stop `npm start`
1. `npm install`
1. restart `npm start`


## Selenium Tests

To run the Selenium tests:

- `npm run test-integration`: runs the tests locally against `http://localhost:3001` by default (also builds the JS files and serves them)
  - Environment Variables
    1. `SERVER_URL="https://example.com"` will run the tests against a remote server
    1. `VERBOSE=true` will print out what is being done as it is running
- `npm run test-integration:only` will just run the tests without building and serving the JS files

To debug the Selenium tests:

- `npm run debug-integration`: Starts up `node-inspector`
  - add `debugger;` to the tests to set a breakpoint that the debugger will stop at
  - change a test from `this.it()` or `@it()` to `this.it.only()` to only run the one test
  - **Note:** you may have to kill the process if you pressed <kbd>Ctrl</kbd>+<kbd>C</kbd>  (ie `ps ax|grep 5858`)

### Pre-production

Before starting up vagrant, you can debug using a more production-like config by:

1. `gulp prod`
2. unzip `/dist/archive.tar.gz` into an `assets/` directory
3. serve the `assets/` directory via NGINX or something with CORS enabled
4. update the paths in `tutor-server/conf/secrets.yml` to point to `http://localhost:[NGINX-PORT]/assets/tutor.min-####.css` and `tutor.min-####.js` respectively
5. in `tutor-server` run `rails s`
6. go to <http://localhost:3001>


[travis-image]: https://img.shields.io/travis/openstax/tutor-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/openstax/tutor-js
[dependency-image]: https://img.shields.io/david/openstax/tutor-js.svg?style=flat-square
[dependency-url]: https://david-dm.org/openstax/tutor-js
[dev-dependency-image]: https://img.shields.io/david/dev/openstax/tutor-js.svg?style=flat-square
[dev-dependency-url]: https://david-dm.org/openstax/tutor-js#info=devDependencies
[codecov-image]: https://img.shields.io/codecov/c/github/openstax/tutor-js.svg
[codecov-url]: https://codecov.io/gh/openstax/tutor-js
