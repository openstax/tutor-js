import { C, Factory, runInAction } from '../../helpers';
import Dashboard from '../../../src/screens/teacher-dashboard/dashboard';
import TimeHelper from '../../../src/helpers/time';

describe('CourseCalendar Month display', () => {
    let course;
    let props = {};

    beforeEach(() => {
        course = Factory.course({ is_teacher: true });
        Factory.teacherTaskPlans({ course });
        props = {
            date: course.teacherTaskPlans.array[0].interval.end,
            course: course,
            dateFormat: TimeHelper.ISO_DATE_FORMAT,
            hasPeriods: true,
            showingSideBar: true,
        };
    });

    it('renders plans and hides when deleting', function() {
        const month = mount(<C><Dashboard {...props} /></C>);
        const plan = course.teacherTaskPlans.array[0];
        // eslint-disable-next-line
        console.log(month.find(`[data-plan-id]`).debug())
        expect(month).toHaveRendered(`[data-plan-id="${plan.id}"]`);
        runInAction( () => plan.is_deleting = true )
        expect(month).not.toHaveRendered(`[data-plan-id="${plan.id}"]`);
    });

    xit('navigates forward and back', function() {
        const m = mount(<C><Dashboard {...props} /></C>);
        m.find('a.calendar-header-control.next').simulate('click');
        m.find('a.calendar-header-control.next').simulate('click');
        expect(m.find('Month').props().date).toEqual(props.date.plus({ month: 2 }))
        m.find('a.calendar-header-control.previous').simulate('click');
        expect(m.find('Month').props().date).toEqual(props.date.plus({ month: 1 }))
        m.unmount();
    });

});
