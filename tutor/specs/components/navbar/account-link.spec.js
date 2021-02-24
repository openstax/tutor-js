import Link from '../../../src/components/navbar/account-link';

import User from '../../../src/models/user';
jest.mock('../../../src/models/user', () => ({ }));

describe('Account Link', function() {
    it('only renders if account profile_url is present', function() {
        User.profile_url = undefined;
        const link = shallow(<Link />);
        expect(link.html()).toBeNull();
    });

    it('renders link with profile url and target set to _blank', function() {
        User.profile_url = 'a.test.url';
        const link = shallow(<Link />);
        expect(link).toHaveRendered('[href="a.test.url"][target="_blank"]');
    });
});
