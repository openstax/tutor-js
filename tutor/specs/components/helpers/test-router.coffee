class TestRouter

  constructor: ->
    @transitionTo     = sinon.spy()
    @replaceWith      = sinon.spy()
    @createHref       = sinon.spy( -> '/' )
    @blockTransitions = sinon.spy()


module.exports = TestRouter
