/* eslint-disable  no-undef */
import Adapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';
import { axe, toHaveNoViolations } from 'jest-axe';
import faker from 'faker';
import React from 'react'; // eslint-disable-line no-unused-vars
import 'jest-styled-components';

faker.seed(123);

enzyme.configure({ adapter: new Adapter() });

// set timeout to 10 seconds
global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
global.React = require('react');
global.shallow = enzyme.shallow;
global.mount   = enzyme.mount;
// Include the jest-axe .toHaveNoViolations()
global.expect.extend(toHaveNoViolations);
global.axe = axe;
global.document.createRange = jest.fn(() => ({
  setStart: () => {},
  setEnd: () => {},
  collapse: jest.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
}));

require('./matchers');
require('./mocks');
