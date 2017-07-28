import { Wrapper, SnapShot } from '../helpers/component-testing';
import moment from 'moment';
import Payments from '../../../src/components/payments/manage';
import Purchases from '../../../src/models/purchases';
import Router from '../../../src/helpers/router';
import PaymentModel from '../../../src/models/payments';
import mockData from '../../../api/purchases.json';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/payments');
jest.mock('../../../src/flux/time', () => ({
  TimeStore: {
    getNow: () => new Date('2017-07-01'),
  },
}));

describe('Student Payments Management', () => {
  beforeEach(() => {
    PaymentModel.config = {
      is_enabled: true,
      base_url: 'url-for-test',
    };
    Router.currentParams.mockReturnValue({ courseId: '2' });
    Router.makePathname.mockImplementation(() => '/foo');
    mockData.orders.forEach((o) => o.purchased_at = '2017-06-24');
    Purchases.onLoaded({ data: mockData });
  });

  it('renders and matches snapshot', () => {
    expect(
      SnapShot.create(<Wrapper noReference _wrapped_component={Payments} />).toJSON()
    ).toMatchSnapshot();
  });

  it('renders empty when no payments', () => {
    Purchases.clear();
    expect(
      SnapShot.create(<Wrapper noReference _wrapped_component={Payments} />).toJSON()
    ).toMatchSnapshot();
  });

});
