import Navbar from '../../../src/components/navbar';
import { Router, Provider } from '../../helpers';
import TourContext from '../../../src/models/tour/context';

jest.mock('../../../src/models/chat');

describe('Main Navbar', () => {
  it('renders and matches snapshot', () => {
    const tourContext = new TourContext();
    expect.snapshot(
      <Router>
        <Provider tourContext={tourContext}>
          <Navbar.bar />
        </Provider>
      </Router>
    ).toMatchSnapshot();
  });
});
