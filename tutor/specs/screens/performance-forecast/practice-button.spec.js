import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import GUIDE from '../../../api/user/courses/1/guide.json';
import * as PerformanceForecast from '../../../src/flux/performance-forecast';
import { CoursePracticeActions, CoursePracticeStore } from '../../../src/flux/practice';
import Button from '../../../src/screens/performance-forecast/practice-button';
const COURSE_ID  = '1';


const failToCreatePractice = function(pageIds) {
  const params =
    { page_ids: pageIds };

  CoursePracticeActions.create(COURSE_ID, params);
  return CoursePracticeActions._failed({}, COURSE_ID, params);
};

describe('Learning Guide Practice Button', function() {

  beforeEach(() => {
    bootstrapCoursesList();
    PerformanceForecast.Student.actions.loaded(GUIDE, COURSE_ID);
  });

  afterEach(() => CoursePracticeActions.reset());

  it('can be rendered and sets the name', () => {
    const button = mount(<Button courseId={COURSE_ID} title="Practice moar" />);
    expect(button.text()).toEqual('Practice moar');
  });

});
