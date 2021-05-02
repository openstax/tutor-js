import Guide from '../../../src/screens/student-dashboard/progress-guide.js';
import { Factory, C, ApiMock, TimeMock, waitFor } from '../../helpers';

import GUIDE_DATA from '../../../api/courses/1/guide.json';


describe('Student Progress Guide', function() {
    let props;
    const now = new Date('2017-10-20T12:00:00.000Z');

    TimeMock.setTo(now);

    ApiMock.intercept({
        'api/courses/1/guide': GUIDE_DATA,
    })

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]

        props = {
            course,
            performance,
        };
    });

    it('navigates to view all topics', () => {
        const panel = mount(<C><Guide {...props} /></C>);
        waitFor(() => !props.course.performance.api.isPending)
        // panel.find('button.view-performance-forecast').simulate('click');
        // expect(panel.instance().pathname).toEqual('/course/1/guide');
        panel.unmount();
    });

});
