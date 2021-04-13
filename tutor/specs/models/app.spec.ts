import App from '../../src/models/app';
import { ApiMock, Factory } from '../helpers'
import Toasts from '../../src/models/toasts';
import { documentReady } from '../../src/helpers/dom';
import Raven from '../../src/models/app/raven';

jest.mock('../../src/helpers/dom', () => ({
    read_csrf: jest.fn(),
    documentReady: jest.fn(() => Promise.resolve()),
}));
jest.mock('../../src/models/app/raven');
jest.mock('../../src/models/toasts', () => ({
    push: jest.fn(),
}));


describe('Tutor App model', () => {
    let app: App;

    const mocks = ApiMock.intercept({
        '/user/bootstrap$': Factory.bot.create('BootstrapData'),
    })

    beforeEach(() => app = new App());

    it('sends a toast notice when assets change', () => {
        app.onNotice({ tutor_assets_hash: 'jasdlkfjla', feature_flags: {} });
        expect(app.tutor_assets_hash).toEqual('jasdlkfjla');
        expect(Toasts.push).not.toHaveBeenCalled();

        app.onNotice({ tutor_assets_hash: 'zjklub',  feature_flags: {} });
        // will not update if it's non-null and different
        expect(app.tutor_assets_hash).toEqual('jasdlkfjla');
        // instead it'll reload
        expect(Toasts.push).toHaveBeenCalledWith({ handler: 'reload' });
    });

    it('boots after document is ready, starts raven and reads data', async () => {
        await App.boot();
        expect(mocks['/user/bootstrap$']).toHaveBeenCalled()
        expect(documentReady).toHaveBeenCalled();
        expect(Raven.boot).toHaveBeenCalled();
    });
});
