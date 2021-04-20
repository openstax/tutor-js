import { R, React, ApiMock, Factory, waitFor } from '../../helpers';
import Router from '../../../src/helpers/router';
import BuilderUX from '../../../src/screens/new-course/ux';
import Wizard from '../../../src/screens/new-course/wizard';
import { OfferingsMap } from '../../../src/models'

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/user', () => ({
    currentUser: {
        canCreateCourses: true,
    },
}));

describe('Creating a course', function() {
    ApiMock.intercept({
        'offerings': { items: [Factory.data('Offering', { id: 1, title: 'Test Offering' })] },
    })

    let props;
    beforeEach(() => {
        Router.currentParams.mockReturnValue({});
        const offerings = new OfferingsMap();
        props = {
            ux: new BuilderUX({
                router: { match: { params: {} } },
                offerings,
            }),
        };
    });

    it('displays as loading and then sets stage when done', async () => {
        const wrapper = mount(<R><Wizard {...props} /></R>);
        expect(props.ux.isBusy).toBe(true);
        expect(wrapper).toHaveRendered('StaxlyAnimation[isLoading=true]');
        await waitFor(() => !props.ux.isBusy)

        // props.ux.offerings.api.requestsInProgress.clear();
        expect(wrapper).toHaveRendered('StaxlyAnimation[isLoading=false]');
    });

    it('advances and can go back', async function() {
        const wrapper = mount(<R><Wizard {...props} /></R>);
        expect(props.ux.isBusy).toBe(true)

        expect(props.ux.currentStageIndex).toEqual(0);
        await waitFor(() => !props.ux.isBusy)

        expect(wrapper).toHaveRendered('SelectCourse');
        expect(wrapper).toHaveRendered('.btn.next[disabled=true]');
        wrapper.find('.choice').simulate('click');
        expect(props.ux.isCurrentStageValid).toBe(true)
        expect(props.ux.canGoForward).toBe(true)
        wrapper.find('.btn.next[disabled=false]').simulate('click');
        expect(props.ux.currentStageIndex).toEqual(1);
        expect(wrapper).toHaveRendered('SelectDates');
        wrapper.find('.btn.back').simulate('click');
        expect(props.ux.currentStageIndex).toEqual(0);
        expect(wrapper).toHaveRendered('SelectCourse');
    });

    it('matches snapshot', function() {
        props.ux.offerings.api.requestsInProgress.clear();
        expect.snapshot(<R><Wizard {...props} /></R>).toMatchSnapshot();
    });
});
