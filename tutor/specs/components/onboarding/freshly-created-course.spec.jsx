import { C } from '../../helpers';
import FreshlyCreatedCourse from '../../../src/components/onboarding/freshly-created-course';

import {
    StudentCourseOnboarding as StudentUX,
    PreviewOnboarding as PreviewUX,
} from '../../../src/components/onboarding/ux'

describe('Freshly Created Course prompt', () => {

    let ux;

    describe('student', () => {
        beforeEach(() => {
            ux = new StudentUX({}, {});
            ux.dismissNag = jest.fn();
        });

        it('renders and matches snapshot', () => {
            expect(<C><FreshlyCreatedCourse ux={ux} /></C>).toMatchSnapshot();
        });
    });

    describe('preview', () => {
        beforeEach(() => {
            ux = new PreviewUX({}, {});
            ux.dismissNag = jest.fn();
        });

        it('renders and matches snapshot', () => {
            expect(<C><FreshlyCreatedCourse ux={ux} /></C>).toMatchSnapshot();
        });
    });

});
