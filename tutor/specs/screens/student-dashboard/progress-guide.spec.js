import Guide from '../../../src/screens/student-dashboard/progress-guide.js';
import { React, C, TimeMock } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import * as PerformanceForecast from '../../../src/flux/performance-forecast';
import GUIDE_DATA from '../../../api/courses/1/guide.json';
const COURSE_ID = '1';

describe('Student Progress Guide', function() {
    let props;
    const now = new Date('2017-10-20T12:00:00.000Z');
    TimeMock.setTo(now);

    beforeEach(function() {
        PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
        bootstrapCoursesList();
        props = {
            courseId: COURSE_ID,
        };
    });

    it('navigates to view all topics', () => {
        const panel = mount(<C><Guide {...props} /></C>);
        panel.find('button.view-performance-forecast').simulate('click');
        expect(panel.instance().pathname).toEqual(`/course/${COURSE_ID}/guide`);
        panel.unmount();
    });

});
