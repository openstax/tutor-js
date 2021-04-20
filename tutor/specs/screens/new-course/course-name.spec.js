import { ApiMock, React, Factory } from '../../helpers';
import CourseName from '../../../src/screens/new-course/course-name';
import BuilderUX from '../../../src/screens/new-course/ux';

jest.mock('../../../src/models/user', () => ({
    currentUser: {
        canCreateCourses: true,
    },
}));

describe('CreateCourse: entering name', function() {
    ApiMock.intercept({
        'offerings': { items: [Factory.data('Offering', { id: 1, title: 'Test Offering' })] },
    })
    let ux;

    beforeEach(() => {
        ux = new BuilderUX({
            router: { match: { params: {} } },
            courses: Factory.coursesMap({ count: 1 }),
            offerings: Factory.offeringsMap({ count: 4 }),
        });
    });

    it('matches snapshot', function() {
        expect.snapshot(<CourseName ux={ux} />).toMatchSnapshot();
    });
});
