import { React, PropTypes, inject, observer } from 'vendor';
import { Dropdown }        from 'react-bootstrap';
import { Icon }            from 'shared';
import Responsive          from '../responsive';
import { Course }          from '../../models';
import SupportMenu         from './support-menu';
import StudentPayNowBtn    from './student-pay-now-btn';
import ActionsMenu         from './actions-menu';
import UserMenu            from './user-menu';
import dom                 from '../../helpers/dom';

const DesktopMenus = observer(({ course }) => (
    <>
        <StudentPayNowBtn    course={course} />
        <SupportMenu         course={course} />
        <ActionsMenu         course={course} />
        <UserMenu />
    </>
));

const MobileMenus = observer(({ course }) => (
    <Dropdown
        className="mobile-menu"
        onToggle={v => dom(document.body).hideOverflow(v) }
    >
        <Dropdown.Toggle
            id="mobile-menu"
            aria-label="Menu and settings"
            variant="ox"
        >
            <Icon type="bars" className="open-icon" size="lg" />
            <Icon type="close" className="close-icon" size="lg" />
        </Dropdown.Toggle>
        <Dropdown.Menu>
            <ActionsMenu course={course} />
            <SupportMenu course={course} />
            <UserMenu />
        </Dropdown.Menu>
    </Dropdown>
));

const Menus = inject('courseContext')(
    observer(
        ({ courseContext: { course } }) => {
            return (
                <Responsive
                    desktop={<DesktopMenus course={course} />}
                    mobile={<MobileMenus course={course} />}
                />
            )
        }
    )
);

Menus.displayName = 'Menus';

Menus.propTypes = {
    course: PropTypes.instanceOf(Course),
};

export { Menus };
