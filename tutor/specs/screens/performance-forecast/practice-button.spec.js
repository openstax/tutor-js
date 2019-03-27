import { React } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import Button from '../../../src/screens/performance-forecast/practice-button';
const COURSE_ID  = '1';

describe('Learning Guide Practice Button', function() {

  beforeEach(() => {
    bootstrapCoursesList();
  });

  it('can be rendered and sets the name', () => {
    const button = mount(<Button courseId={COURSE_ID} title="Practice moar" />);
    expect(button.text()).toEqual('Practice moar');
  });

});
