/* eslint-disable  no-undef */
import Adapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';
import faker from 'faker';
import React from 'react'; // eslint-disable-line no-unused-vars
import 'jest-styled-components';
import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS } from 'styled-components';

require('jest-fetch-mock').enableMocks()

faker.seed(123);

enzyme.configure({ adapter: new Adapter() });

// set timeout to 10 seconds
global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
global.React = require('react');
global.shallow = enzyme.shallow;
global.mount   = enzyme.mount;

if (!global.document.createRange) {
    global.document.createRange = jest.fn(() => ({
        setStart: () => {},
        setEnd: () => {},
        collapse: jest.fn(),
        commonAncestorContainer: {
            nodeName: 'BODY',
            ownerDocument: document,
        },
    }));
}
if (!global.window.customElements) {
    global.customElements = {
        get: () => false,
        define: () => false,
    };
}

Object.defineProperty(window, 'scrollTo', { value: jest.fn(), writable: true });

require('./matchers');
require('./mocks');
