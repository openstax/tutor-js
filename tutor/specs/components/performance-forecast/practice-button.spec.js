import { Testing, ld } from 'helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import { CoursePracticeActions, CoursePracticeStore } from '../../../src/flux/practice';
import PerformanceForecast from '../../../src/flux/performance-forecast';
import Button from '../../../src/components/performance-forecast/practice-button';

const COURSE_ID  = '1';
import GUIDEldDATA from '../../../api/courses/1/guide.json';

const failToCreatePractice = function(pageIds) {
  const params =
    { page_ids: pageIds };

  CoursePracticeActions.create(COURSE_ID, params);
  return CoursePracticeActions._failed({}, COURSE_ID, params);
};

describe('Learning Guide Practice Button', function() {

  beforeEach(() => {
    bootstrapCoursesList();
    PerformanceForecast.Student.actions.loaded(GUIDE_DATA, COURSE_ID);
  });

  afterEach(() => CoursePracticeActions.reset());

  it('can be rendered and sets the name', () =>
    Testing.renderComponent( Button,
      { props: { courseId: COURSE_ID, title: 'Practice moar' } }
    ).then(async ({ dom }) => {
      expect(await axe(dom.outerHTML)).toHaveNoViolations();
      expect(dom.textContent).toEqual('Practice moar');
    })
  );

});
