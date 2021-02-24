import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import * as PerformanceForecast from '../../../src/flux/performance-forecast';
import Guide from '../../../src/screens/performance-forecast/guide';
import GUIDE_DATA from '../../../api/courses/1/guide.json';
const COURSE_ID = '1'; // needs to be a string, that's what LoadableItem expects


describe('Learning Guide', function() {
    let props;

    beforeEach(function() {
        PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
        bootstrapCoursesList();
        props = {
            courseId: COURSE_ID,
            allSections: [],
            weakerTitle: 'weaker',
        };
    });


    it('renders panel for each chapter', function() {
        expect.snapshot(<Guide {...props} />).toMatchSnapshot();
    });

});
