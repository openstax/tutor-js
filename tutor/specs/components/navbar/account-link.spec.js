import Link from '../../../src/components/navbar/account-link';
import { runInAction } from '../../helpers';
import { currentUser } from '../../../src/models';

describe('Account Link', function() {
    it('only renders if account profile_url is present', function() {
        runInAction(() => currentUser.profile_url = undefined);
        const link = shallow(<Link />);
        expect(link.html()).toBeNull();
    });

    it('renders link with profile url and target set to _blank', function() {
        runInAction(() => currentUser.profile_url = 'a.test.url');
        const link = shallow(<Link />);
        expect(link).toHaveRendered('[href="a.test.url"][target="_blank"]');
    });
});
