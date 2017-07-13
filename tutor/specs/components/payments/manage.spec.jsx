import { Wrapper, SnapShot } from '../helpers/component-testing';
import Payments from '../../../src/components/payments/manage';
import Router from '../../../src/helpers/router';

const mockData = require('../../../api/purchases.json');

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/purchases', () => ({
  array: { map: (cb) => mockData.map(cb) },
  fetch: jest.fn(),
}));

describe('Student Payments Management', () => {

  it('renders and matches snapshot', () => {
    Router.currentParams.mockReturnValue({ courseId: '2' });
    Router.makePathname.mockImplementation(() => '/foo');
    expect(
      SnapShot.create(<Wrapper noReference _wrapped_component={Payments} />).toJSON()
    ).toMatchSnapshot();
  });

});
