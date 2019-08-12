import { C } from '../../helpers';
import FreshlyCreatedCourse from '../../../src/components/onboarding/freshly-created-course';
import StudentUX from '../../../src/models/course/onboarding/student-course';
import PreviewUX from '../../../src/models/course/onboarding/preview';

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
