export * from 'shared/specs/helpers';
import { MemoryRouter as Router } from 'react-router-dom';
import ReactTestUtils from 'react-dom/test-utils';
import moment from 'moment';
import PropTypes from 'prop-types';
import TestRouter from './test-router';
import TutorRouter from '../../src/helpers/router';
import TimeMock from './time-mock';
import Factory, { FactoryBot } from '../factories';
import Theme from '../../src/theme';
import { R, C, wrapInDnDTestContext } from './context';

export function getPortalNode(modal) {
  return modal.find('Portal').first().getDOMNode();
}

const delay = (timeout = 3) =>
  new Promise(done => {
    jest.useRealTimers();
    setTimeout(() => {
      done();
    }, timeout);
  });

const deferred = (fn, timeout = 3) => delay(timeout).then(fn);

export {
  Router, TimeMock, TestRouter, TutorRouter, delay, moment,
  Factory, FactoryBot, deferred, C, R, ReactTestUtils,
  wrapInDnDTestContext, Theme, PropTypes,
};
