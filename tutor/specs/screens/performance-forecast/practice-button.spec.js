import { React, R } from '../../helpers';
import { bootstrapCoursesList } from '../../courses-test-data';
import Button from '../../../src/screens/performance-forecast/practice-button';
const COURSE_ID  = '1';

describe('Learning Guide Practice Button', function() {

  beforeEach(() => {
    bootstrapCoursesList();
  });

  it('can be rendered and sets the name', () => {
    const button = mount(<R><Button courseId={COURSE_ID} title="Practice moar" /></R>);
    expect(button.text()).toEqual('Practice moar');
  });

});
