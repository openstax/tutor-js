import { Factory, R } from '../../helpers';
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
        <R><UserActionsMenu {...props} /></R>
      ).toMatchSnapshot();
    });

    it('should have link to browse the book', () => {
      const menu = mount(<R><UserActionsMenu  {...props} /></R>);
      menu.find('ReactOverlaysDropdownToggle').simulate('click');
      expect(menu).toHaveRendered('BrowseBookDropdownItem');
    });

    it('should have performance forecast menu', () => {
      const menu = mount(<R><UserActionsMenu  {...props} /></R>);
      menu.find('ReactOverlaysDropdownToggle').simulate('click');
      expect(menu).toHaveRendered('[name="viewPerformanceGuide"]');
    });
  };


describe('Student Navbar Component', testWithRole(false));

describe('Teacher Navbar Component', testWithRole(true));
