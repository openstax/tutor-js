import { React, TimeMock, FakeWindow } from '../../../helpers';
import ExerciseControls from '../../../../src/screens/assignment-builder/homework/exercise-controls';
import UX from '../../../../src/screens/assignment-builder/ux';
import Factory from '../../../factories';

describe('choose exercises component', () => {
  let exercises, props, plan, ux, course, page_ids;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(function() {
    course = Factory.course({ now });
    plan = Factory.teacherTaskPlan({ course, now });

    ux = new UX({ course, plan, windowImpl: new FakeWindow });
    exercises = Factory.exercisesMap({ now, book: ux.referenceBook });

    props = {
      ux,
      exercises,
      unDocked: true,
      setSecondaryTopControls: jest.fn(),
      sectionizerProps: {
        currentSection: '1.2',
        onSectionClick: jest.fn(),
        chapter_sections: ['1.1', '1.2', '3.1'],
      },
    };
  });

  it('should show add button if plan can be edited', function() {
    const c = mount(<ExerciseControls {...props} />);
    expect(c).toHaveRendered('Button[className="add-sections"]');
  });

  it('should show review button once exercises are selected', function() {
    const c = mount(<ExerciseControls {...props} />);
    props.ux.plan.settings.exercise_ids = [ 1,2,3 ];
    expect(c).toHaveRendered('Button[className="cancel-add"]');
  });
});
