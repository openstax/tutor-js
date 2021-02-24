import { Factory, R } from '../helpers';
import CourseBreadcrumb from '../../src/components/course-breadcrumb';

describe('Course Breadcrumb', () => {
    let props;

    beforeEach(function() {
        props = {
            course: Factory.course(),
            currentTitle: 'Current Task',
        };
    });

    it('renders and matches snapshot', () => {
        expect.snapshot(<R><CourseBreadcrumb {...props} /></R>).toMatchSnapshot();
    });
});
