import { autorun } from 'mobx';
import FakeWindow from 'shared/../specs/helpers/fake-window';
import WindowSize from '../../src/models/window-size';

// https://github.com/facebook/jest/issues/3465#issuecomment-351186130
jest.mock('lodash/debounce', () => jest.fn(fn => fn));

jest.useFakeTimers();

describe('auto-updating window size', () => {
    let fakeWindow: FakeWindow;
    let size: any;

    beforeEach(() => {
        fakeWindow = new FakeWindow();
        size = new WindowSize({ windowImpl: fakeWindow as any });
    });

    it('can be read without observing', () => {
        expect(size.readSize(fakeWindow)).toEqual({ height: 1024, width: 768 });
        expect(fakeWindow.addEventListener).not.toHaveBeenCalled();
    });

    it('updates its values when listened', () => {
        const spy = jest.fn();
        const release = autorun(() => spy(size.current));
        expect(fakeWindow.addEventListener).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);

        fakeWindow.innerWidth = 800;
        fakeWindow.addEventListener.mock.calls[0][1]();

        jest.runAllTimers()

        expect(spy).toHaveBeenCalledTimes(2);
        expect(size.width).toEqual(800);
        expect(fakeWindow.removeEventListener).not.toHaveBeenCalled();
        release();
        expect(fakeWindow.removeEventListener).toHaveBeenCalledTimes(1);
    });

});
