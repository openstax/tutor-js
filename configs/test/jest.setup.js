/* eslint-disable  no-undef */
import Adapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';
import { axe, toHaveNoViolations } from 'jest-axe';
import faker from 'faker';
import React from 'react'; // eslint-disable-line no-unused-vars
import 'jest-styled-components';
import { __DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS } from 'styled-components';

// per https://github.com/styled-components/styled-components/issues/1613#issuecomment-529992291 the ghosts are both spooky & friendly
__DO_NOT_USE_OR_YOU_WILL_BE_HAUNTED_BY_SPOOKY_GHOSTS.StyleSheet.reset(true);

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
