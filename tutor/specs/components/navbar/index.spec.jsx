import Navbar from '../../../src/components/navbar';
import { Wrapper, SnapShot } from '../helpers/component-testing';
jest.mock('../../../src/models/chat');

describe('Main navbar', () => {
  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={Navbar} noReference />).toJSON()
    ).toMatchSnapshot();
  });
});
