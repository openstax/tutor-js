import { fetchMock } from '../../helpers'
import PendingVerification from '../../../src/components/my-courses/pending-verification';
import User from '../../../src/models/user';

jest.mock('../../../src/models/chat');

describe('My Courses Pending Verification Component', function() {

    it('renders and matches snapshot', () => {
        User.fetch = jest.fn()
        fetchMock.mockResponseOnce(JSON.stringify({ test: true }))
        expect.snapshot(<PendingVerification />).toMatchSnapshot();
    });

});
