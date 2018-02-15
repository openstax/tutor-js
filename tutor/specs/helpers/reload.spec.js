import { isReloaded, reloadOnce, forceReload } from '../../src/helpers/reload';


describe('Reloading window', () => {
  beforeEach(() => {
    Object.defineProperties(window.location, {
      search: {
        writable: true,
        value: '',
      },
      reload: {
        writable: true,
        value: jest.fn(),
      },
      href: {
        writable: true,
        value: 'https://tutor.org/dashboard',
      },
    });
    Object.defineProperty(window.history, 'pushState', {
      writable: true,
      value: jest.fn(),
    });
  });

  it('detects if page is reloaded', () => {
    expect(isReloaded()).toEqual(false);

    window.location.search = '?foo&reloaded';
    expect(isReloaded()).toEqual(true);
  });

  it('reloads page once', () => {
    expect(isReloaded()).toEqual(false);
    reloadOnce();
    expect(window.history.pushState).toHaveBeenCalledWith('', '', `${window.location.href}?reloaded`);
    expect(window.location.reload).toHaveBeenCalledWith(true); // true == no-cache
  });

  it('retains existing query params', () => {
    window.location.href = 'http://openstax.org/test?test=true';
    reloadOnce();
    expect(window.history.pushState).toHaveBeenCalledWith('', '', 'http://openstax.org/test?test=true&reloaded');
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });

  it('can force a page reload', () => {
    expect(isReloaded()).toEqual(false);
    forceReload();
    expect(isReloaded()).toEqual(false); // force reload doesn't change the search, it just reloads
    expect(window.location.reload).toHaveBeenCalledWith(true);
  });

});
