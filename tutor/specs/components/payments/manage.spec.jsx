import { C, ApiMock, TimeMock } from '../../helpers';
import Payments from '../../../src/components/payments/manage';
import renderer from 'react-test-renderer';
import { currentPurchases } from '../../../src/models';
import Router from '../../../src/helpers/router';
import mockData from '../../../api/purchases.json';

jest.mock('../../../src/helpers/router');

describe('Student Payments Management', () => {

    TimeMock.setTo(new Date('2017-07-01'));

    ApiMock.intercept({
        'purchases': mockData,
    })

    beforeEach(() => {
        Router.currentParams.mockReturnValue({ courseId: '2' });
        Router.makePathname.mockImplementation(() => '/foo');
    });

    it('renders and matches snapshot', async () => {
        const component = renderer.create(<C noRef><Payments /></C>)

        // clearing react lifecycle
        await new Promise(resolve => setTimeout(resolve, 1));
        await new Promise(resolve => setTimeout(resolve, 1));

        expect.snapshot(component).toMatchSnapshot();
        component.unmount()
    });

    it('renders empty when no payments', () => {
        currentPurchases.clear();
        expect.snapshot(<C noRef><Payments /></C>).toMatchSnapshot();
    });

});
