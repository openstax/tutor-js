import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import ReactTestUtils from 'react-dom/test-utils';
import Renderer from 'react-test-renderer';
import { Provider } from 'mobx-react';
import Factory from '../factories';
import FakeWindow from './fake-window';

const ld = require('lodash');

export {
    ld, Factory, React, Router, ReactTestUtils, Renderer, Provider, FakeWindow,
};
