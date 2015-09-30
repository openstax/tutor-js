# tutor-js [![Build Status](https://travis-ci.org/openstax/tutor-js.svg?branch=master)](https://travis-ci.org/openstax/tutor-js) [![devDependency Status](https://david-dm.org/openstax/tutor-js/dev-status.svg)](https://david-dm.org/openstax/tutor-js#info=devDependencies)

The JavaScript client for openstax Tutor.

## Install

1. install [nodejs](http://nodejs.org) from the website or using <http://brew.sh> if you’re already using it
1. `npm install -g gulp` to install [gulp](http://gulpjs.com) globally
1. Git Clone this repository to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js` move into the checked out directory
1. `npm install`
1. `npm start`
1. Point your browser to <http://localhost:8000> to use the mock data in `/api`


## Development

- `npm start` starts up a local development webserver which rebuilds files when changed
- `npm test` runs unit tests
- `npm run coverage` generates a code coverage report
- `gulp prod` builds minified files for production

Use `PORT=8000 npm start` to change the default webserver port.

Deprecated:

- `gulp serve` builds files and starts up a static webserver
- `gulp dev` watches and rebuilds CSS and JS files and starts webserver
- `gulp tdd` does what `dev` does plus reruns unit tests


After local updates are made:

1. stop `npm start`
1. `npm install`
1. restart `npm start`

### Pre-production

Before starting up vagrant, you can debug using a more production-like config by:

1. `gulp prod`
2. unzip `/dist/archive.tar.gz` into an `assets/` directory
3. serve the `assets/` directory via NGINX or something with CORS enabled
4. update the paths in `tutor-server/conf/secrets.yml` to point to `http://localhost:[NGINX-PORT]/assets/tutor.min-####.css` and `tutor.min-####.js` respectively
5. in `tutor-server` run `rails s`
6. go to <http://localhost:3001>
