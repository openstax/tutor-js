import { fetchMock } from '../../helpers'
import PendingVerification from '../../../src/components/my-courses/pending-verification';
import { currentUser } from '../../../src/models';

jest.mock('../../../src/helpers/chat');

describe('My Courses Pending Verification Component', function() {

    it('renders and matches snapshot', () => {
        currentUser.fetch = jest.fn()
        fetchMock.mockResponseOnce(JSON.stringify({ test: true }))
        expect.snapshot(<PendingVerification />).toMatchSnapshot()
    });

});
