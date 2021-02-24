import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import Section from '../../../src/screens/performance-forecast/section';
import GUIDE from '../../../api/user/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Section Panel', function() {

    let props;

    beforeEach(function() {
        bootstrapCoursesList();
        props = {
            section: GUIDE.children[0].children[0],
            courseId: '1',
        };});

    it('is accessible', async () => {
        const section = mount(<Section {...props} />);
        expect(await axe(section.html())).toHaveNoViolations();
    });

    it('reports how many problems were worked', function() {
        const total = props.section.questions_answered_count;
        const section = mount(<Section {...props} />);
        expect(section.text())
            .toContain(`${pluralize(' problems', total, true)} worked in this section`);

    });
});
