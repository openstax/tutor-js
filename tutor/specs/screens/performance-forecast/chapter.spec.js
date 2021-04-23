import { React } from '../../helpers';
import { Factory } from '../../helpers'
import Chapter from '../../../src/screens/performance-forecast/chapter';
import GUIDE_DATA from '../../../api/courses/1/guide.json';

import pluralize from 'pluralize';

describe('Learning Guide Chapter Panel', function() {
    let props;

    beforeEach(function() {
        const course = Factory.course()
        course.performance.periods.replace([ GUIDE_DATA ])
        const performance = course.performance.periods[0]
        props = {
            course,
            performance,
            chapter: performance.children[0],
        };});

    it('reports how many problems were worked', () => {
        const total = props.chapter.questions_answered_count;
        const chapter = mount(<Chapter {...props} />);
        expect(chapter.text())
            .toContain(`${pluralize(' problems', total, true)} worked in this chapter`);
    });

});
