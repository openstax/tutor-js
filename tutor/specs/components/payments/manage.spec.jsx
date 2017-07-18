import { Wrapper, SnapShot } from '../helpers/component-testing';
import Payments from '../../../src/components/payments/manage';
import Purchases from '../../../src/models/purchases';
import Router from '../../../src/helpers/router';

import mockData from '../../../api/purchases.json';

jest.mock('../../../src/helpers/router');

describe('Student Payments Management', () => {
  beforeEach(() => {
    Purchases.onLoaded({ data: mockData });
  });

  it('renders and matches snapshot', () => {
    Router.currentParams.mockReturnValue({ courseId: '2' });
    Router.makePathname.mockImplementation(() => '/foo');
    expect(
      SnapShot.create(<Wrapper noReference _wrapped_component={Payments} />).toJSON()
    ).toMatchSnapshot();
  });

});
