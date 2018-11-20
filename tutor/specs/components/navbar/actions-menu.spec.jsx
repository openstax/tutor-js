import { Factory } from '../../helpers';
import UserActionsMenu from '../../../src/components/navbar/actions-menu';


const testWithRole = is_teacher =>

  function() {
    let props;

    beforeEach(() => {
      props = {
        course: Factory.course({ is_teacher }),
      };
    });

    it('has actions menu that matches snapshot', function() {
      expect.snapshot(
        <UserActionsMenu {...props} />
      ).toMatchSnapshot();
    });

    it('should have link to browse the book', () => {
      const menu = shallow(<UserActionsMenu  {...props} />);
      expect(menu).toHaveRendered('BrowseBookDropdownItem');
    });

    it('should have performance forecast menu', () => {
      const menu = shallow(<UserActionsMenu  {...props} />);
      expect(menu).toHaveRendered('[name="viewPerformanceGuide"]');
    });
  };


describe('Student Navbar Component', testWithRole(false));

describe('Teacher Navbar Component', testWithRole(true));
