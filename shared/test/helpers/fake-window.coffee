defer = require 'lodash/defer'
merge = require 'lodash/merge'
isFunction = require 'lodash/isFunction'


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
    merge(@, attrs)
    for name, method of @ when isFunction(method)
      sinon.spy(@, name)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()
    @history =
      pushState: sinon.spy()

module.exports = FakeWindow
