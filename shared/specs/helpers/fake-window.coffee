defer = require 'lodash/defer'
merge = require 'lodash/merge'
isFunction = require 'lodash/isFunction'
cloneDeep = require 'lodash/cloneDeep'
{ JSDOM } = require 'jsdom'

EmptyFn = ->
  return undefined

class FakeWindow
  clearInterval: EmptyFn
  setInterval: -> jest.fn( -> Math.random() )
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
  innerHeight: 1024
  innerWidth:  768

  constructor: (attrs = {}) ->
    merge(@, attrs)
    for name, method of @ when isFunction(method)
      # jest.fn(@, name) was causing some weird stack trace on the above methods...
      @[name] = jest.fn(method)
    @localStorage =
      getItem: sinon.stub().returns('[]')
      setItem: sinon.stub()
    @history =
      pushState: jest.fn()
    @open = jest.fn( =>
      @openedDOM = new JSDOM('<!DOCTYPE html><body></body>')
      return @openedDOM.window
    )
    @screen =
      height: 1024
      width:  768
    @addEventListener = jest.fn()
    @removeEventListener = jest.fn()

module.exports = FakeWindow
