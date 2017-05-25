import { SnapShot } from '../helpers/component-testing';
import StudentPreview from '../../../src/components/student-preview';

describe('Student Preview Builder', () => {

  it('renders and matches snapshot', () => {
    expect(SnapShot.create(<StudentPreview />).toJSON()).toMatchSnapshot();
  });

});
