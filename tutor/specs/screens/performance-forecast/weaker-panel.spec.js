import { React, ld } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import * as PerformanceForecast from '../../../src/flux/performance-forecast';
import Weaker from '../../../src/screens/performance-forecast/weaker-panel';
import GUIDE_DATA from '../../../api/courses/1/guide.json';
const COURSE_ID = '1';

// import { Testing, ld } from 'helpers';
// import { bootstrapCoursesList } from '../../courses-test-data';
//
// import Weaker from '../../../src/components/performance-forecast/weaker-panel';
// import PerformanceForecast from '../../../src/flux/performance-forecast';
// import GUIDE from '../../../api/courses/1/guide.json';

describe('Weaker Section Panel', function() {
    let props;

    beforeEach(function() {
        bootstrapCoursesList();
        PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
        return props = {
            courseId: COURSE_ID,
            sections: PerformanceForecast.Student.store.getAllSections(COURSE_ID),
            weakerTitle: 'Weaker',
            weakerExplanation: 'Stuff you suck at',
            weakerEmptyMessage: 'Not enough data',
        };});

    it('displays the title', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker.text()).toContain(props.weakerTitle);
    });


    it('hides practice button if canPractice property is not given', function() {
        const weaker = mount(<Weaker {...props} />);
        expect(weaker).not.toHaveRendered('.practice.btn');
    });

    it('does not render if there are no sections', function() {
        props.sections = [];
        const weaker = shallow(<Weaker {...props} />);
        expect(weaker.html()).toBeNull();
    });

    it('hides practice button if no sections are shown', function() {
        const section = ld.first(props.sections);
        props.sections = [section];
        section.is_real = false;
        const weaker = shallow(<Weaker {...props} />);
        expect(weaker).not.toHaveRendered('.practice.btn');
    });
});
