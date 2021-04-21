import { React, TimeMock, Factory, C, runInAction } from '../../helpers';

import Theme from '../../../src/theme';
import Row from '../../../src/screens/student-dashboard/event-row';

describe('Homework Row', function() {
    let props;
    const now = new Date('2017-10-14T12:00:00.000Z');
    TimeMock.setTo(now);

    beforeEach(function() {
        props = {
            event: Factory.studentDashboardTask({ type: 'homework', now }),
            course: Factory.course(),
        };
    });

    it('renders in progress', () => {
        runInAction(() => {
            props.event.completed_steps_count = 1;
            props.event.due_at = new Date('2017-10-15T12:00:00.000Z');
        })
        expect.snapshot(<C><Row {...props} /></C>).toMatchSnapshot();
    });

    it('renders with completed count', function() {
        runInAction(() => props.event.correct_exercise_count = null )
        expect.snapshot(<C><Row {...props} /></C>).toMatchSnapshot();
    });

    it('renders complete', function() {
        runInAction(() => {
            props.event.complete = true;
            props.event.completed_steps_count = 1;
        })
        const row = mount(<C><Row {...props} /></C>);
        expect(row.find('StatusCell').text()).toContain('Complete');
        row.unmount();
    });

    it('renders icon', () => {
        runInAction(() => {
            props.event.completed_steps_count = 1;
            props.event.due_at = new Date(now.getTime() + ( 18*60*60*1000 ));
            props.event.complete = false;
        })
        const row = mount(<C><Row {...props} /></C>);
        expect(row).toHaveRendered('Icon[type="exclamation-circle"]');

        runInAction(() => {
            props.event.due_at = new Date(now.getTime() - ( 36*60*60*1000 ));
        })
        expect(row).toHaveRendered(`Icon[type="clock"][color="${Theme.colors.danger}"]`);

        row.unmount();
    });

});
