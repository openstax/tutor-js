import { C } from '../../helpers';
import NewCourse from '../../../src/screens/new-course';

jest.mock('../../../src/models/loader');
jest.mock('../../../src/models/user', () => ({
  terms_signatures_needed: false,
  isAllowedInstructor: true,
}));

describe('NewCourse wrapper', function() {

  it('renders and matches snapshot', () => {
    expect(<C><NewCourse /></C>).toMatchSnapshot();
  });

});
