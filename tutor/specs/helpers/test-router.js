class TestRouter {

  constructor({ pathname = '/', params = {} } = {}) {
    this.route = {
      hash: '',
      search: '',
      location: { pathname },
      match: {
        params,
      },
    };

    this.history = {
      createHref: jest.fn(),
      listen: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    };
  }
}

export default TestRouter;
