import React from 'react';
import { MemoryRouter as Router } from 'react-router-dom';
import Renderer from 'react-test-renderer';
import { Provider } from 'mobx-react';
import Factory from '../factories';
import FakeWindow from './fake-window';
export * from 'mobx';
import ld from 'lodash';
import { FetchMock } from 'jest-fetch-mock';

const fetchMock = fetch as FetchMock;

export {
    ld, Factory, React, Router, Renderer, Provider, FakeWindow, fetchMock,
};
