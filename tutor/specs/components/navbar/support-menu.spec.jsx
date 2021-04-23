import { C, Factory } from '../../helpers';
import SupportMenu from '../../../src/components/navbar/support-menu';
import { TourRegion, TourContext } from '../../../src/models';
import { Chat } from '../../../src/helpers/chat';
import { hydrateModel, runInAction } from '../../helpers';

jest.mock('../../../src/helpers/chat');
// jest.mock('../../../src/models/tour/region');
jest.mock('../../../src/models/user', () => ({
    currentUser: {
        tourAudienceTags: ['teacher'],
    },
}));

describe('Support Menu', () => {
    let tourContext;
    let region;
    let props;

    beforeEach(() => {
        runInAction(() => {
            Chat.isEnabled = false;
            tourContext = hydrateModel(TourContext, { isEnabled: true });
        });
        region = hydrateModel(TourRegion, { id: 'teacher-calendar', courseId: '2' });
        props = {
            tourContext,
            course: Factory.course(),
        };
    });

    it('only renders page tips option if available', () => {
        const menu = mount(<C withTours={tourContext}><SupportMenu  {...props} /></C>);
        expect(menu).not.toHaveRendered('.page-tips');
        region = hydrateModel(TourRegion, { id: 'foo', courseId: '2', otherTours: ['teacher-calendar'] });
        runInAction(() => tourContext.openRegion(region));
        expect(tourContext.hasTriggeredTour).toBe(true);
        menu.find('button.dropdown-toggle').simulate('click');
        expect(menu).toHaveRendered('.page-tips');
        menu.unmount();
    });

    it('calls chat when clicked', () => {
        runInAction(() => Chat.isEnabled = true);
        const menu = mount(<C><SupportMenu {...props} /></C>);
        menu.find('button.dropdown-toggle').simulate('click');
        menu.find('.chat.enabled a').simulate('click');
        expect(Chat.start).toHaveBeenCalled();
        menu.unmount();
    });

    it('renders support links when in a course for teacher', () => {
        runInAction(() => props.course.appearance_code = 'college_biology');
        const menu = mount(<C><SupportMenu {...props} /></C>);
        expect(menu).toHaveRendered('#menu-support-document');
        menu.unmount();
    });

});
