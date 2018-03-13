import App from '../../src/models/app';
import Toasts from '../../src/models/toasts';

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
});
