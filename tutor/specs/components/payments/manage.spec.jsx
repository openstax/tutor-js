import { C } from '../../helpers';
import moment from 'moment';
import Payments from '../../../src/components/payments/manage';
import Purchases from '../../../src/models/purchases';
import Router from '../../../src/helpers/router';
import PaymentModel from '../../../src/models/payments';
import mockData from '../../../api/purchases.json';
import { TimeStore } from '../../../src/flux/time';
import TimeHelper from '../../../src/helpers/time';
import chronokinesis from 'chronokinesis';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/payments');


describe('Student Payments Management', () => {
  beforeEach(() => {
    PaymentModel.config = {
      is_enabled: true,
      base_url: 'url-for-test',
    };
    chronokinesis.travel(new Date('2017-07-01'));

    Router.currentParams.mockReturnValue({ courseId: '2' });
    Router.makePathname.mockImplementation(() => '/foo');
    Purchases.onLoaded({ data: mockData });
  });

  afterEach(() => {
    chronokinesis.reset();
  });

  it('renders and matches snapshot', () => {
    expect.snapshot(<C noRef><Payments /></C>).toMatchSnapshot();
  });

  it('renders empty when no payments', () => {
    Purchases.clear();
    expect.snapshot(<C noRef><Payments /></C>).toMatchSnapshot();
  });

});
