chai = require('chai')
sinon = require('sinon')
sinonChai = require('sinon-chai')
chai.use(sinonChai)
isFunction = require('lodash/isFunction')

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

global.expect = (actual) ->
  originalMatchers = originalExpect(actual)
  chaiMatchers = chai.expect(actual)
  combinedMatchers = Object.assign(chaiMatchers, originalMatchers)
  combinedMatchers

global.chia = chai
global.sinon = sinon
global.jasmineExpect = global.expect

global.expect = (actual) ->
  originalMatchers = global.jasmineExpect(actual)
  chaiMatchers = chai.expect(actual)
  combinedMatchers = Object.assign(chaiMatchers, originalMatchers)
  combinedMatchers
