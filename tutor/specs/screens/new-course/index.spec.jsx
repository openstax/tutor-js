import { C } from '../../helpers';
import NewCourse from '../../../src/screens/new-course';


jest.mock('../../../src/models/user', () => ({
    currentUser: {
        terms_signatures_needed: false,
        canCreateCourses: true,
    },
}));

describe('NewCourse wrapper', function() {

    it('renders and matches snapshot', () => {
        expect(<C><NewCourse /></C>).toMatchSnapshot();
    });

});
