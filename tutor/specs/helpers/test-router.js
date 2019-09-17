class TestRouter {

  constructor({ pathname = '/', params = {} } = {}) {
    this.match = { params };

    this.location = { pathname };

    this.history = {
      createHref: jest.fn(),
      listen: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    };
  }
}

export default TestRouter;
