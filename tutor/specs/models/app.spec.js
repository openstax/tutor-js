import App from '../../src/models/app';
import Toasts from '../../src/models/toasts';
import { documentReady } from '../../src/helpers/dom';
import Raven from '../../src/models/app/raven';

jest.mock('../../src/helpers/dom', () => ({
  fetch: jest.fn(() => ({ courses: [] })),
  documentReady: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../src/models/app/raven');
jest.mock('../../src/models/toasts', () => ({
  push: jest.fn(),
}));


describe('Tutor App model', () => {
  let app;

  beforeEach(() => app = new App());

  it('sends a toast notice when assets change', () => {
    app.onNotice({ tutor_assets_hash: 'jasdlkfjla' });
    expect(app.tutor_assets_hash).toEqual('jasdlkfjla');
    expect(Toasts.push).not.toHaveBeenCalled();

    app.onNotice({ tutor_assets_hash: 'zjklub' });
    // will not update if it's non-null and different
    expect(app.tutor_assets_hash).toEqual('jasdlkfjla');
    // instead it'll reload
    expect(Toasts.push).toHaveBeenCalledWith({ handler: 'reload' });
  });

  it('boots after document is ready, starts raven and reads data', async () => {
    await App.boot();
    expect(documentReady).toHaveBeenCalled();
    expect(Raven.boot).toHaveBeenCalled();
  });
});
