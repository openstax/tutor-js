import { Factory } from '../helpers'
import { TourContext, Time } from '../../src/models'
import CourseNag from '../../src/components/course-nag';
import ModalManager from '../../src/components/modal-manager';
import { PreviewOnboarding as Onboarding } from '../../src/components/onboarding/ux'
import { observable } from 'mobx';

jest.mock('../../src/models/tour/context', () => {
    class MockContext {
        tour = {}
    }
    return {
        TourContext: MockContext,
    }
});


function SomethingToDo() { return <span>Hi!</span>; }

describe('Second Session Warning', () => {

    let ux, modalManager, tourContext, props, spyMode;

    beforeEach(() => {
        ux = observable.object({
            nagComponent: SomethingToDo,
            course: Factory.course({ is_teacher: true }),
        });
        spyMode = observable.object({ isEnabled: false });
        modalManager = new ModalManager();
        tourContext = new TourContext();
        props = {
            spyMode,
            tourContext,
            modalManager,
        };
    });

    it('renders and matches snapshot', () => {
        const nag = mount(<CourseNag {...props}/>);
        expect(nag).toHaveRendered('CourseNagModal');
    });

    it('replays tours when spy mode is triggered', () => {
        const nag = mount(<CourseNag {...props} />);
        const onboarding = new Onboarding(ux.course, tourContext);
        ux.course.primaryRole.joined_at = Time.now //.minus({ month: 1 })
        expect(ux.course.isActive).toBe(true)
        expect(onboarding.courseIsNaggable).toBe(false);
        spyMode.isEnabled = true;
        nag.setProps({ spyMode });
        expect(onboarding.courseIsNaggable).toBe(true);
    });

});
