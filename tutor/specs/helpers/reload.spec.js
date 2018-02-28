import { isReloaded, reloadOnce, forceReload } from '../../src/helpers/reload';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe('Reloading window', () => {
  let win;
  beforeEach(() => win = new FakeWindow());

  it('detects if page is reloaded', () => {
    expect(isReloaded(win)).toEqual(false);
    win.location.search = '?foo&reloaded';
    expect(isReloaded(win)).toEqual(true);
  });

  it('reloads page once', () => {
    expect(win.location.reload).not.toHaveBeenCalled();
    expect(isReloaded(win)).toEqual(false);
    reloadOnce(win);
    expect(win.history.pushState).toHaveBeenCalledWith('', '', `${win.location.href}?reloaded`);
    expect(win.location.reload).toHaveBeenCalledWith(true); // true == no-cache
  });

  it('retains existing query params', () => {
    win.location.href = 'http://openstax.org/test?test=true';
    reloadOnce(win);
    expect(win.history.pushState).toHaveBeenCalledWith('', '', 'http://openstax.org/test?test=true&reloaded');
    expect(win.location.reload).toHaveBeenCalledWith(true);
  });

  it('can force a page reload', () => {
    expect(isReloaded(win)).toEqual(false);
    forceReload(win);
    expect(isReloaded(win)).toEqual(false); // force reload doesn't change the search, it just reloads
    expect(win.location.reload).toHaveBeenCalledWith(true);
  });

});
