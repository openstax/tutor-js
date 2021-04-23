import ModalManager from '../../../src/components/modal-manager';
import TourConductor from '../../../src/components/tours/conductor';
import { SpyModeContext } from 'shared/components/spy-mode';
import { currentUser } from '../../../src/models';
import { runInAction } from '../../helpers';

jest.mock('../../../src/models/user', () => ({
    currentUser: {
        resetTours: jest.fn(),
        tourAudienceTags: ['teacher'],
    },
}));

describe('Tour Conductor', () => {
    let props, spyMode;

    beforeEach(() => {
        spyMode = new SpyModeContext();
        props = {
            spyMode,
        };
    });

    it('replays tours when spy mode is triggered', async () => {
        const wrapper = mount(
            <ModalManager>
                <TourConductor {...props}><span>Hi</span></TourConductor>
            </ModalManager>
        );
        runInAction(() => spyMode.isEnabled = true);
        expect(currentUser.resetTours).toHaveBeenCalled();
        wrapper.unmount()
    });

});
