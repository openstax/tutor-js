# tutor-js

The JavaScript client for openstax Tutor.

## Install

1. install <http://nodejs.org> (from the website or using <http://brew.sh> if you’re already using it)
1. install gulp and bower globally: `npm install -g gulp bower` (<http://gulpjs.com> and <http://bower.io>)
1. `git clone https://github.com/openstax/tutor-js` to the directory of your choice
  - If you don’t have `git` installed you can install homebrew and then `brew install git`
1. `cd tutor-js`
1. `npm install`
1. `npm test` (or `gulp dist`)   (builds the JS and CSS)
1. `npm start` (or `gulp serve`) (opens up a browser window)


## Development

To build the dist version run `gulp dist`.

To run a standalone webserver run `gulp serve`.

To do TDD (rerun tests when the source code changes) run `gulp tdd`
