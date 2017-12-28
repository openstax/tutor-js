import Navbar from '../../../src/components/navbar';
import { Wrapper, SnapShot } from '../helpers/component-testing';
import { bootstrapCoursesList } from '../../courses-test-data';
jest.mock('../../../src/models/chat');

describe('Main navbar', () => {
  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Navbar.bar} noReference />).toJSON()
    ).toMatchSnapshot();
  });
});
