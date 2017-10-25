class TestRouter

  constructor: (pathname = '/') ->
    @route = {
      hash: ''
      search: ''
      location: { pathname }
    }

    @history = {
      createHref: jest.fn()
      push: jest.fn()
      replace: jest.fn()
    }

module.exports = TestRouter
