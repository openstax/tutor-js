import { map } from 'lodash';
import { shallow } from 'enzyme';
import { Wrapper, SnapShot } from '../helpers/component-testing';
import UserActionsMenu from '../../../src/components/navbar/actions-menu';
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

    it('has actions menu that matches snapshot', function() {
      expect(SnapShot.create(
        <Wrapper _wrapped_component={UserActionsMenu}  {...props} />).toJSON()
      ).toMatchSnapshot();
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
