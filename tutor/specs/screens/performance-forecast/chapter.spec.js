import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import Chapter from '../../../src/screens/performance-forecast/chapter';
import GUIDE_DATA from '../../../api/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Chapter Panel', function() {
    let props;

    beforeEach(function() {
        bootstrapCoursesList();
        props = {
            chapter: GUIDE_DATA.children[0],
            courseId: '1',
        };});

    it('reports how many problems were worked', () => {
        const total = props.chapter.questions_answered_count;
        const chapter = mount(<Chapter {...props} />);
        expect(chapter.text())
            .toContain(`${pluralize(' problems', total, true)} worked in this chapter`);
    });

    it('is accessible', async () => {
        const chapter = mount(<Chapter {...props} />);
        expect(await axe(chapter.html())).toHaveNoViolations();
    });
});
