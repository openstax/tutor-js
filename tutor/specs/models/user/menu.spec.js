import SnapShot from 'react-test-renderer';
import Courses from '../../../src/models/courses-map';
import UserMenu from '../../../src/models/user/menu';
import User from '../../../src/models/user';
import { bootstrapCoursesList } from '../../courses-test-data';

jest.mock('../../../src/models/user', () => ({
  isConfirmedFaculty: true,
}));

describe('Current User Store', function() {

  beforeEach(function() {
    bootstrapCoursesList();
  });

  afterEach(function() {
    Courses.clear();
  });

  it('computes help URL', () => {
    expect(UserMenu.helpURL).toContain('Tutor');
    expect(UserMenu.helpLinkForCourseId(1)).toContain('Tutor');
    Courses.get(1).is_concept_coach = true;
    expect(UserMenu.helpURL).toContain('Tutor');
    expect(UserMenu.helpLinkForCourseId(1)).toContain('Coach');
  });

  it('should return expected menu routes for courses', function() {
    User.isConfirmedFaculty = false;
    expect(UserMenu.getRoutes('1')).toMatchSnapshot();
    expect(UserMenu.getRoutes('2')).toMatchSnapshot();
    Courses.clear();
    expect(UserMenu.getRoutes()).toMatchSnapshot();
  });
});
