import TBS from '../../../src/components/buttons/teacher-become-student';
import Factory from '../../factories';
import FeatureFlags from '../../../src/models/feature_flags';

jest.mock('../../../src/models/feature_flags');

describe(TBS, () => {
  let props;

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('only renders when it should', () => {
    FeatureFlags.teacher_student_enabled = true;
    const tbs = mount(<TBS {...props} />);
    expect(tbs).toBeEmptyRender();
    props.course.roles[0].type = 'teacher';
    tbs.update();
    expect(tbs).not.toBeEmptyRender();
    tbs.unmount();
  });
});
