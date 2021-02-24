import { React } from '../helpers';
import WarningModal from '../../src/components/warning-modal';

describe('warning modal', () => {
    let props;
    beforeEach(() => {
        props = {
            title: 'This is a warning',
            message: 'WARNING WILL ROBERTSON!',
        };
    });

    it('matches snapshot', () => {
        const warn = mount(<WarningModal {...props} />);
        expect(warn).toHaveRendered('Portal');
    });


});
