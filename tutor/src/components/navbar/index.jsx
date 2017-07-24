import React from 'react';

import Router                from '../../helpers/router';
import Courses               from '../../models/courses-map';
import TutorLink             from '../link';
import ServerErrorMonitoring from '../error-monitoring';
import UserActionsMenu       from './user-actions-menu';
import BookLinks             from './book-links';
import CenterControls        from './center-controls';
import PreviewAddCourseBtn   from './preview-add-course-btn';
import SupportMenu           from './support-menu';
import StudentPreviewLink    from './student-previews-link';
import StudentPayNowBtn      from './student-pay-now-btn';

export default function NavigationBar() {
  const params = Router.currentParams();
  const { courseId } = params;
  const course = courseId ? Courses.get(courseId) : null;

  return (
    <nav className="tutor-top-navbar">
      <div className="tutor-nav-controls">
        <div className="left-side-controls">
          <TutorLink to="myCourses" className="brand">
            <i className="ui-brand-logo" />
          </TutorLink>
          <BookLinks courseId={courseId} />
        </div>
        <CenterControls params={params} />
        <div className="right-side-controls">
          <PreviewAddCourseBtn courseId={courseId} />
          <StudentGetAccessBtn courseId={courseId} />
          <SupportMenu />
          <StudentPreviewLink  courseId={courseId} />
          <UserActionsMenu     courseId={courseId} />
        </div>
      </div>
      <ServerErrorMonitoring />
    </nav>
  );
}
