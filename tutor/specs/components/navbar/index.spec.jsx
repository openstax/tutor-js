import Navbar from '../../../src/components/navbar';
import { Provider } from 'mobx-react';
import { MemoryRouter as R } from 'react-router-dom';
import { Wrapper, SnapShot } from '../helpers/component-testing';
import { bootstrapCoursesList } from '../../courses-test-data';
import TourContext from '../../../src/models/tour/context';
jest.mock('../../../src/models/chat');

describe('Main navbar', () => {
  it('renders and matches snapshot', () => {
    const tourContext = new TourContext();
    expect(
      SnapShot.create(
        <R>
          <Provider tourContext={tourContext}>
            <Navbar.bar />
          </Provider>
        </R>
      ).toJSON()
    ).toMatchSnapshot();
  });
});
