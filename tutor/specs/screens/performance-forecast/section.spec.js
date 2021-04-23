import { Factory } from '../../helpers'
import Section from '../../../src/screens/performance-forecast/section';
import GUIDE_DATA from '../../../api/user/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Section Panel', function() {

    let props;

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]
        props = {
            course,
            performance,
            section: performance.children[0].children[0],
        };});

    it('reports how many problems were worked', function() {
        const total = props.section.questions_answered_count;
        const section = mount(<Section {...props} />);
        expect(section.text())
            .toContain(`${pluralize(' problems', total, true)} worked in this section`);
        section.unmount()
    });
});
