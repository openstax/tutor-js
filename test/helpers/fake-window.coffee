_ = require 'underscore'

EmptyFn = ->
  return undefined

class FakeWindow
  clearInterval: EmptyFn
  setInterval: -> Math.random()
  document:
    hidden: false

  constructor: ->
    for method in _.functions(@)
      sinon.spy(@, method)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()

module.exports = FakeWindow
