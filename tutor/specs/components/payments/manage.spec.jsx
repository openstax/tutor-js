import { C, TimeMock } from '../../helpers';
import Payments from '../../../src/components/payments/manage';
import Purchases from '../../../src/models/purchases';
import Router from '../../../src/helpers/router';
import PaymentModel from '../../../src/models/payments';
import mockData from '../../../api/purchases.json';

jest.mock('../../../src/helpers/router');
jest.mock('../../../src/models/payments');


describe('Student Payments Management', () => {

    TimeMock.setTo(new Date('2017-07-01'));

    beforeEach(() => {
        PaymentModel.config = {
            is_enabled: true,
            base_url: 'url-for-test',
        };


        Router.currentParams.mockReturnValue({ courseId: '2' });
        Router.makePathname.mockImplementation(() => '/foo');
        Purchases.onLoaded({ data: mockData });
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C noRef><Payments /></C>).toMatchSnapshot();
    });

    it('renders empty when no payments', () => {
        Purchases.clear();
        expect.snapshot(<C noRef><Payments /></C>).toMatchSnapshot();
    });

});
