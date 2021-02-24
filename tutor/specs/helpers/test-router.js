class TestRouter {

    constructor({ push, pathname = '/', params = {} } = {}) {
        this.match = { params };

        this.location = { pathname };

        this.history = {
            createHref: jest.fn(),
            listen: jest.fn(),
            push: push || jest.fn(),
            replace: jest.fn(),
            location: {
                pathname,
            },
        };
    }
}

export default TestRouter;
