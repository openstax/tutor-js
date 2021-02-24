import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import * as PerformanceForecast from '../../../src/flux/performance-forecast';
import Weaker from '../../../src/screens/performance-forecast/weaker-sections';
import GUIDE_DATA from '../../../api/courses/1/guide.json';
const COURSE_ID = '1';

describe('Weaker Sections listing', function() {
    let props;

    beforeEach(function() {
        bootstrapCoursesList();
        PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
        return props = {
            courseId: COURSE_ID,
            sections: PerformanceForecast.Student.store.getAllSections(COURSE_ID),
            weakerEmptyMessage: 'Not enough data',
        };});

    it('renders forecast bars', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker).toHaveRendered('PerformanceForecastProgressBar');
    });

});
