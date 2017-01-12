chai = require('chai')
sinon = require('sinon')
sinonChai = require('sinon-chai')
chai.use(sinonChai)
isFunction = require('lodash/isFunction')

global.enzyme = require 'enzyme'
chaiEnzyme = require('chai-enzyme')
chai.use(chaiEnzyme())

global.Promise = require.requireActual('es6-promise')

# https://github.com/facebook/jest/issues/1730

# Make sure chai and jasmine ".not" play nice together
originalNot = Object.getOwnPropertyDescriptor(chai.Assertion.prototype, 'not').get
Object.defineProperty chai.Assertion.prototype, 'not',
  get: ->
    Object.assign this, @assignedNot
    originalNot.apply this
  set: (newNot) ->
    @assignedNot = newNot
    newNot

# Combine both jest and chai matchers on expect
originalExpect = global.expect

# bump up timeout to 30 seconds
global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000

process.on 'unhandledRejection', (reason, p) ->
  console.error("Possibly Unhandled Rejection at: Promise ", p, " reason: ", reason)

global.chia = chai
global.sinon = sinon
global.jasmineExpect = global.expect
global.shallow = enzyme.shallow
global.mount   = enzyme.mount
global.expect = (actual) ->
  originalMatchers = global.jasmineExpect(actual)
  chaiMatchers = chai.expect(actual)
  combinedMatchers = Object.assign(chaiMatchers, originalMatchers)
  combinedMatchers

global.expect.extend = originalExpect.extend

require './matchers'
