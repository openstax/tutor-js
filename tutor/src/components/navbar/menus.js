import { React, PropTypes, inject, observer } from 'vendor';
import { Dropdown }        from 'react-bootstrap';
import { Icon }            from 'shared';
import Responsive          from '../responsive';
import Course              from '../../models/course';
import SupportMenu         from './support-menu';
import StudentPayNowBtn    from './student-pay-now-btn';
import ActionsMenu         from './actions-menu';
import PreviewAddCourseBtn from './preview-add-course-btn';
import UserMenu            from './user-menu';

const DesktopMenus = observer(({ course }) => (
  <>
    <StudentPayNowBtn    course={course} />
    <SupportMenu         course={course} />
    <ActionsMenu         course={course} />
    <PreviewAddCourseBtn course={course} />
    <UserMenu />
  </>
));

const MobileMenus = observer(({ course }) => (
  <Dropdown
    className="mobile-menu"
    onToggle={(v) => {
      const el = window.document.querySelector('body');
      v ? el.classList.add('freeze-scroll') : el.classList.remove('freeze-scroll');
    }}
  >
    <Dropdown.Toggle
      id="mobile-menu"
      aria-label="Menu and settings"
      variant="ox"
    >
      <Icon type="bars" className="open-icon" />
      <Icon type="close" className="close-icon" />
    </Dropdown.Toggle>
    <Dropdown.Menu>
      <SupportMenu course={course} />
      <ActionsMenu course={course} />
      <UserMenu />
    </Dropdown.Menu>
  </Dropdown>
));

const Menus = inject('courseContext')(
  observer(
    ({ courseContext: { course } }) => (
      <Responsive
        desktop={<DesktopMenus course={course} />}
        mobile={<MobileMenus course={course} />}
      />
    )
  )
);

Menus.displayName = 'Menus';

Menus.propTypes = {
  course: PropTypes.instanceOf(Course),
};

export { Menus };
