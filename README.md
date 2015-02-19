# tutor-js [![Build Status](https://travis-ci.org/openstax/tutor-js.svg?branch=master)](https://travis-ci.org/openstax/tutor-js) [![devDependency Status](https://david-dm.org/openstax/tutor-js/dev-status.svg)](https://david-dm.org/openstax/tutor-js#info=devDependencies)

The JavaScript client for openstax Tutor.

## Install

1. install [nodejs](http://nodejs.org) from the website or using <http://brew.sh> if you’re already using it
1. `npm install -g gulp bower` to install [gulp](http://gulpjs.com) and [bower](http://bower.io) globally
1. `git clone https://github.com/openstax/tutor-js` to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js`
1. `npm install`
1. `bower install`
1. `npm start` (or `gulp serve`) (opens up a browser window)


## Development

To run tests: `npm test`.

To build the dist version run `gulp dist`.

To run a standalone webserver run `gulp serve`.

To do TDD (rerun tests when the source code changes) run `gulp tdd`
