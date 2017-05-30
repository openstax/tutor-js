import { map } from 'lodash';
import { shallow } from 'enzyme';

import UserActionsMenu from '../../../src/components/navbar/user-actions-menu';
import { setupStores, resetStores, courseModel } from './spec-test-params';
import FakeWindow from 'shared/specs/helpers/fake-window';

const testWithRole = roleType =>

  function() {
    let props;
    let roleTestParams;

    beforeEach(function() {
      roleTestParams = setupStores(roleType);
      return (
          props = {
            courseId: courseModel.id,
            windowImpl: new FakeWindow,
          }
      );
    });

    afterEach(() => resetStores(roleType));

    it('should have expected dropdown menu', function() {
      const menu = shallow(<UserActionsMenu {...props} />);
      const labels = map(roleTestParams.menu, 'label');
      menu.find('MenuItem').forEach((item, index) => {
        expect(item.render().text()).to.equal(labels[index]);
      });
    });

    it('should have link to browse the book', () => {
      const menu = shallow(<UserActionsMenu {...props} />);
      expect(menu).toHaveRendered('BrowseBookMenuItem');
    });

    it('should have performance forecast menu', () => {
      const menu = shallow(<UserActionsMenu {...props} />);
      expect(menu).toHaveRendered('[data-name="viewPerformanceGuide"]');
    });
  };


describe('Student Navbar Component', testWithRole('student'));

describe('Teacher Navbar Component', testWithRole('teacher'));
