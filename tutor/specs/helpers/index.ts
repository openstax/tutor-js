export * from '../../../shared/specs/helpers'
import { MemoryRouter as Router } from 'react-router-dom';
import TestRouter from './test-router';
import TutorRouter from '../../src/helpers/router';
import TimeMock from './time-mock';
import Factory, { FactoryBot } from '../factories';
import Theme from '../../src/theme';
import { R, C, wrapInDnDTestContext } from './context';
export * from 'modeled-mobx'

export function getPortalNode(modal: any) {
    return modal.find('Portal').first().getDOMNode();
}

const delay = async (timeout = 3) =>
    await new Promise(done => {
        jest.useRealTimers();
        setTimeout(() => {
            done(null);
        }, timeout);
    });

const deferred = (fn: any, timeout = 3) => delay(timeout).then(fn);

export const waitFor = async (cb: () => any) => {
    for (let i = 0; i < 30; i++) {
        const result = cb()
        if (result) {
            return result
        }
        await delay(100)
    }
}

export {
    Router, TimeMock, TestRouter, TutorRouter, delay,
    Factory, FactoryBot, deferred, C, R,
    wrapInDnDTestContext, Theme,
};
