import { React, PropTypes, inject, observer } from '../../helpers/react';
import Course              from '../../models/course';
import SupportMenu         from './support-menu';
import StudentPayNowBtn    from './student-pay-now-btn';
import ActionsMenu         from './actions-menu';
import PreviewAddCourseBtn from './preview-add-course-btn';
import UserMenu            from './user-menu';

const Menus = inject('courseContext')(
  observer(
    ({ courseContext: { course } }) => (
      <React.Fragment>
        <SupportMenu         course={course} />
        <StudentPayNowBtn    course={course} />
        <ActionsMenu         course={course} />
        <PreviewAddCourseBtn course={course} />
        <UserMenu />
      </React.Fragment>
    )
  )
);

Menus.displayName = 'Menus';

Menus.propTypes = {
  course: PropTypes.instanceOf(Course),
};

export { Menus }
