defer = require 'lodash/defer'
merge = require 'lodash/merge'
isFunction = require 'lodash/isFunction'
cloneDeep = require 'lodash/cloneDeep'


EmptyFn = ->
  return undefined

class FakeWindow
  clearInterval: EmptyFn
  setInterval: -> sinon.spy( -> Math.random() )
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
      # sinon.spy(@, name) was causing some weird stack trace on the above methods...
      @[name] = sinon.spy(method)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()
    @history =
      pushState: sinon.spy()
    windowRef = cloneDeep(@)
    @open = sinon.spy( => windowRef )
    @screen =
      height: 1024
      width:  768
    @addEventListener = sinon.spy()
    @removeEventListener = sinon.spy()

module.exports = FakeWindow
