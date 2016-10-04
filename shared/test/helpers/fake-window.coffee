_ = require 'underscore'

EmptyFn = ->
  return undefined

class FakeWindow
  clearInterval: EmptyFn
  setInterval: -> Math.random()
  document:
    hidden: false
  pageYOffset: 0
  pageXOffset: 0
  scroll: (x, y) ->
    @pageXOffset = x
    @pageYOffset = y
  requestAnimationFrame: (cb) -> _.defer cb
  querySelector: (sb) -> null

  constructor: ->
    for method in _.functions(@)
      sinon.spy(@, method)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()
    @history =
      pushState: sinon.spy()


module.exports = FakeWindow
