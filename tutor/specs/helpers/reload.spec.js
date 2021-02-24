import { isReloaded, reloadOnce, forceReload } from '../../src/helpers/reload';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe('Reloading window', () => {
    let windowImpl;
    beforeEach(() => windowImpl = new FakeWindow());

    it('detects if page is reloaded', () => {
        expect(isReloaded({ windowImpl })).toEqual(false);
        windowImpl.location.href = 'http://foo.test.com?foo&reloaded';
        expect(isReloaded({ windowImpl } )).toEqual(true);
    });

    it('reloads page once', () => {
        expect(windowImpl.location.reload).not.toHaveBeenCalled();
        expect(isReloaded({ windowImpl } )).toEqual(false);
        reloadOnce({ windowImpl });
        expect(windowImpl.history.pushState).toHaveBeenCalledWith('', '', `${windowImpl.location.href}?reloaded`);
        expect(windowImpl.location.reload).toHaveBeenCalledWith(true); // true == no-cache
    });

    it('retains existing query params', () => {
        windowImpl.location.href = 'http://openstax.org/test?test=true';
        reloadOnce({ windowImpl });
        expect(windowImpl.history.pushState).toHaveBeenCalledWith('', '', 'http://openstax.org/test?test=true&reloaded');
        expect(windowImpl.location.reload).toHaveBeenCalledWith(true);
    });

    it('can force a page reload', () => {
        expect(isReloaded({ windowImpl })).toEqual(false);
        forceReload({ windowImpl });
        expect(isReloaded({ windowImpl })).toEqual(false); // force reload doesn't change the search, it just reloads
        expect(windowImpl.location.reload).toHaveBeenCalledWith(true);
    });

});
