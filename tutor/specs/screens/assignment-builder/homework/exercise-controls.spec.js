import { React, TimeMock, FakeWindow } from '../../../helpers';
import ExerciseControls from '../../../../src/screens/assignment-builder/homework/exercise-controls';
import ChapterSection from '../../../../src/models/chapter-section';
import UX from '../../../../src/screens/assignment-builder/ux';
import Factory from '../../../factories';

describe('choose exercises component', () => {
  let exercises, props, plan, ux, course, page_ids;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(async () => {
    course = Factory.course({ now });
    plan = Factory.teacherTaskPlan({ course, now, is_published: false, type: 'homework' });

    ux = new UX();
    await ux.initialize({ course, plan, windowImpl: new FakeWindow });
    exercises = Factory.exercisesMap({ now, book: ux.referenceBook });

    props = {
      ux,
      exercises,
      unDocked: true,
      setSecondaryTopControls: jest.fn(),
      sectionizerProps: {
        currentSection: new ChapterSection('1.2'),
        onSectionClick: jest.fn(),
        chapter_sections: ['1.1', '1.2', '3.1'].map(cs => new ChapterSection(cs)),
      },
    };
  });

  it('should show add button if plan can be edited', function() {
    const c = mount(<ExerciseControls {...props} />);
    expect(c).toHaveRendered('Button[className="add-sections"]');
    c.unmount();
  });

  it('should show review button once exercises are selected', function() {
    const c = mount(<ExerciseControls {...props} />);
    props.ux.plan.settings.exercise_ids = [ 1,2,3 ];
    expect(c).toHaveRendered('Button[className="cancel-add"]');
    c.unmount();
  });

  it('increases/decreases counts', () => {
    const c = mount(<ExerciseControls {...props} />);
    expect(c.find('.tutor-selections').text()).toEqual('0');
    c.find('Icon[type="chevron-up"]').simulate('click');
    expect(c.find('.tutor-selections').text()).toEqual('1');
    c.find('Icon[type="chevron-down"]').simulate('click');
    expect(c.find('.tutor-selections').text()).toEqual('0');
    expect(c).not.toHaveRendered('Icon[type="chevron-down"]');
    c.unmount();
  });
});
