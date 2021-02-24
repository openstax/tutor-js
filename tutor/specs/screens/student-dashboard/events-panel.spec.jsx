import { TimeMock, React, C } from '../../helpers';
import { map } from 'lodash';
import Factory from '../../factories';
import EventsPanel from '../../../src/screens/student-dashboard/events-panel';

describe('EventsPanel', function() {
    let props;
    const now = new Date('2017-10-14T12:00:00.000Z');
    TimeMock.setTo(now);

    beforeEach(() => {
        const course = Factory.course();
        Factory.studentTaskPlans({ course, now });
        props = {
            course,
            events: course.studentTaskPlans.array,
        };
    });


    it('renders with events as named', function() {
        const wrapper = mount(<C><EventsPanel {...props} /></C>);
        const renderedTitles = wrapper.find('TitleCell').map(t => t.text());
        const mockTitles = map(props.events, 'title');
        expect(renderedTitles).toEqual(expect.arrayContaining(mockTitles));
        wrapper.unmount();
    });

});
