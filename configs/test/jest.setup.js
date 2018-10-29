import Adapter from 'enzyme-adapter-react-16';
import enzyme from 'enzyme';
import { axe, toHaveNoViolations } from 'jest-axe';
import faker from 'faker';
import React from 'react';
import Renderer from 'react-test-renderer';
faker.seed(123);

enzyme.configure({ adapter: new Adapter() });

// bump up timeout to 30 seconds
global.jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// process.on('unhandledRejection', (reason, p) => console.error('Possibly Unhandled Rejection at: Promise ', p, ' reason: ', reason));

global.React = require('react');

global.shallow = enzyme.shallow;
global.mount   = enzyme.mount;

// Include the jest-axe .toHaveNoViolations()
global.expect.extend(toHaveNoViolations);


global.expect.snapshot = (obj) => {
  const json = React.isValidElement(obj) ? Renderer.create(obj).toJSON() : obj;
  return global.expect(json);
}


global.axe = axe;

require('./matchers');
