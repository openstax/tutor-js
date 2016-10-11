defer = require 'lodash/defer'
merge = require 'lodash/merge'

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
  requestAnimationFrame: (cb) -> defer(cb)
  querySelector: (sb) -> null
  location:
    pathname: '/'
    search: ''
  constructor: (attrs = {}) ->
    for method in _.functions(@)
      sinon.spy(@, method)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()
    @history =
      pushState: sinon.spy()
    merge(@, attrs)

module.exports = FakeWindow
