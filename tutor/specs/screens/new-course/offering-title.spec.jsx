import { React, Factory } from '../../helpers';
import OfferingTitle from '../../../src/screens/new-course/offering-title';

describe('CreateCourse: choosing offering', function() {

    it('doesn’t blow up when appearance code from offering is invalid', async function() {
        const offering = Factory.offering();
        offering.appearance_code = 'firefirefire';
        const wrapper = shallow(<OfferingTitle offering={offering} />);
        expect(wrapper).toHaveRendered('[data-appearance="firefirefire"]');
        wrapper.unmount()
    });

    it('matches snapshot', function() {
        const offering = Factory.offering();
        expect.snapshot(<OfferingTitle offering={offering} />).toMatchSnapshot();
    });

});
