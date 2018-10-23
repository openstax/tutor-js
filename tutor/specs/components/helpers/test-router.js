class TestRouter {

  constructor(pathname = '/') {
    this.route = {
      hash: '',
      search: '',
      location: { pathname },
    };

    this.history = {
      createHref: jest.fn(),
      push: jest.fn(),
      replace: jest.fn(),
    };
  }
}

export default TestRouter;
