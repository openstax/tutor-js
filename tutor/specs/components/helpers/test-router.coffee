class TestRouter

  constructor: ->
    @history = {
      createHref: jest.fn()
      push: jest.fn()
      replace: jest.fn()
    }

module.exports = TestRouter
