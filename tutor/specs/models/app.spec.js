import App from '../../src/models/app';
import Toasts from '../../src/models/toasts';
import { readBootstrapData } from '../../src/helpers/dom';
import Raven from '../../src/models/app/raven';

jest.mock('../../src/helpers/dom');
jest.mock('../../src/models/app/raven');
jest.mock('../../src/models/toasts', () => ({
  push: jest.fn(),
}));


describe('Tutor App model', () => {
  let app;

  beforeEach(() => app = new App());

  it('sends a toast notice when url changes', () => {
    app.onNotice({ tutor_js_url: 'test.com' });
    expect(app.tutor_js_url).toEqual('test.com');
    expect(Toasts.push).not.toHaveBeenCalled();

    app.onNotice({ tutor_js_url: 'test.com/new-js' });

    expect(app.tutor_js_url).toEqual('test.com');
    expect(Toasts.push).toHaveBeenCalledWith({ handler: 'reload' });
  });

  it('boots raven and reads data', () => {
    App.boot();
    expect(readBootstrapData).toHaveBeenCalled();
    expect(Raven.boot).toHaveBeenCalled();
  });
});
