# tutor-js
[![build status][travis-image]][travis-url]
[![Coverage][codecov-image]][codecov-url]
[![dependency status][dependency-image]][dependency-url]
[![dev dependency status][dev-dependency-image]][dev-dependency-url]

The Front-end code for Openstax Tutor related projects

## Install

1. install [nvm](https://github.com/creationix/nvm)
  - run `nvm install` in this directory to install and use the correct version of node
  - _Alternatively:_ manually install the right version of node in [./.nvmrc](./.nvmrc)
1. Git Clone this repository to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js` move into the checked out directory
1. `npm install`
1. `npm run serve <project>` *(where <project is one of tutor|coach|exercises)*
1. Point your browser to <http://localhost:8000> to use the mock data in `/api`
 - Or run the Tutor server as shown below to use real data

## Development

- `npm run serve <project>` starts up a local development webserver which rebuilds files when changed
- `npm test <project>` runs unit tests for all projects
- `npm run coverage` generates a code coverage report
- `npm run build <project> archive` builds minified files for production

Use `PORT=8000 npm start` to change the default webserver port.

After local updates are made:

1. stop `npm start`
1. `npm install`
1. restart `npm start`


### Tutor Server

Using the sample API data only allows acting as a student and can't save data.  For a more realistic development experience you'll also need to run the [Tutor server](https://github.com/openstax/tutor-server)

1. Install Tutor Server as shown in its README file
1. Start both the tutor-server Rails application and run `npm run serve tutor` in this project's directory
1. Load <http://localhost:3001> in your browser
  - Once you click login, the server will present a dev console that allows you to select a user
1. And will then render the FE just as it appears in production



[travis-image]: https://img.shields.io/travis/openstax/tutor-js.svg?style=flat-square
[travis-url]: https://travis-ci.org/openstax/tutor-js
[dependency-image]: https://img.shields.io/david/openstax/tutor-js.svg?style=flat-square
[dependency-url]: https://david-dm.org/openstax/tutor-js
[dev-dependency-image]: https://img.shields.io/david/dev/openstax/tutor-js.svg?style=flat-square
[dev-dependency-url]: https://david-dm.org/openstax/tutor-js#info=devDependencies
[codecov-image]: https://img.shields.io/codecov/c/github/openstax/tutor-js.svg
[codecov-url]: https://codecov.io/gh/openstax/tutor-js
