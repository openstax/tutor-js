_ = require 'underscore'

EmptyFn = ->
  return undefined

class FakeWindow
  clearInterval: EmptyFn
  setInterval: -> Math.random()
  localStorage:
    getItem: -> []
    setItem: EmptyFn
  document:
    hidden: false

  constructor: ->
    for method in _.functions(@)
      sinon.spy(@, method)

module.exports = FakeWindow
