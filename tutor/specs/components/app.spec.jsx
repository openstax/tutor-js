import { C } from '../helpers';
import App from '../../src/components/app';
import { currentUser } from '../../src/models';

jest.mock('../../src/models/user', () => ({
    currentUser: {
        tourAudienceTags: [],
        recordSessionStart: jest.fn(),
        logEvent: jest.fn(),
        verifiedRoleForCourse() {
            return 'teacher';
        },
        can_create_courses: true,
        terms: {
            areSignaturesNeeded: false,
            fetchIfNeeded() {},
            api: {
                isPending: false,
            },
        },
    }
}));

jest.mock('../../src/helpers/chat');

describe('main Tutor App', () => {

    let props;

    beforeEach(() => {
        props = {
            app: {},
            location: { pathname: '/' },
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<C><App {...props} /></C>).toMatchSnapshot();
    });


    it('records user session', () => {
        mount(<C><App {...props} /></C>);
        expect(currentUser.recordSessionStart).toHaveBeenCalled();
    });

});
