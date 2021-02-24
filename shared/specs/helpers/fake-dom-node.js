import extend from 'lodash/extend';

// implements just enought to work with ScrollSpy and HTML mixins

class FakeDOMNode {
    constructor(attrs) {
        extend(
            this,
            {
                style: {},
                ownerDocument: { styleSheets: [] },
                querySelectorAll: jest.fn( () => []),
                querySelector: jest.fn( () => undefined),
                getElementsByTagName: jest.fn( () => []),
                getBoundingClientRect: jest.fn( () => ({})),
            },
            attrs,
        );
    }
}

export default FakeDOMNode;
