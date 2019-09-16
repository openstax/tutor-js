import { R } from '../../helpers';
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
    const tbs = mount(<R><TBS {...props} /></R>);
    expect(tbs).toBeEmptyRender();
    props.course.roles[0].type = 'teacher';
    tbs.update();
    expect(tbs).not.toBeEmptyRender();
    tbs.unmount();
  });

  it('renders as button when single ACTIVE period', () => {
    props.course.roles[0].type = 'teacher';
    const tbs = mount(<R><TBS {...props} /></R>);
    expect(tbs).toHaveRendered('Dropdown');
    expect(tbs).not.toHaveRendered('BecomeButton');
    props.course.periods.forEach((p, i) => p.is_archived = i !== 0);
    expect(tbs).not.toHaveRendered('Dropdown');
    expect(tbs).toHaveRendered('BecomeButton');
    tbs.unmount();
  });
});
