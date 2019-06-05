import { C, EnzymeContext } from '../../helpers';
import TBS from '../../../src/components/buttons/teacher-become-student';
import Factory from '../../factories';
import FakeWindow from 'shared/specs/helpers/fake-window';

describe(TBS, () => {
  let props

  beforeEach(() => {
    props = {
      course: Factory.course(),
    };
  });

  it('displays for periods', () => {
    const tbs = mount(<TBS {...props} />);

    console.log(tbs);
    tbs.unmount();
  });
});
