import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { action, observable } from 'mobx';
import { includes } from 'lodash';

import UpcomingPanel from './upcoming-panel';
import AllEventsByWeek from './all-events-by-week';
import ThisWeekPanel from './this-week-panel';

import ProgressGuideShell from './progress-guide';
import BrowseTheBook from '../../components/buttons/browse-the-book';
import CourseTitleBanner from '../../components/course-title-banner';

import Courses from '../../models/courses-map';
import Tabs from '../../components/tabs';
import { NotificationsBar } from 'shared';
import NotificationHelpers from '../../helpers/notifications';
import TourRegion from '../../components/tours/region';
import Surveys from './surveys';

export default class StudentDashboard extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: React.PropTypes.object,
  }

  @observable tabIndex = 0;

  @action.bound
  onTabSelection(tabIndex, ev) {
    if (includes([0, 1], tabIndex)) {
      this.tabIndex = tabIndex;
    } else {
      ev.preventDefault();
    }
  }

  renderPastWork(course) {
    return (
      <div className="tab-pane active" role="tabpanel">
        <AllEventsByWeek courseId={course.id} isCollege={course.is_college} />
      </div>
    );
  }

  renderThisWeek(course) {
    return (
      <div className="tab-pane active" role="tabpanel">
        <ThisWeekPanel courseId={course.id} isCollege={course.is_college} />
        <UpcomingPanel courseId={course.id} isCollege={course.is_college} />
      </div>
    );
  }

  render() {
    const { tabIndex, props: { courseId } } = this;
    const course = Courses.get(courseId);
    return (
      <div className="dashboard">
        <NotificationsBar
          role={course.primaryRole.serialize()}
          course={course.serialize()}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={courseId} />
        <TourRegion
          id="student-dashboard"
          otherTours={["about-late", "assignment-progress"]}
          courseId={courseId}
          className="container"
        >
          <Row>
            <Col xs={12} md={8} lg={9}>
              <Tabs
                params={this.props.params}
                onSelect={this.onTabSelection}
                tabs={['This Week', 'All Past Work']} />
              {tabIndex === 0 ? this.renderThisWeek(course) : this.renderPastWork(course)}
            </Col>
            <Col xs={12} md={4} lg={3} className="sidebar">
              <Surveys course={course} />
              <ProgressGuideShell courseId={courseId} />
              <div className="actions-box">
                <BrowseTheBook
                  unstyled
                  course={course}
                  data-appearance={course.appearance_code}
                >
                  <div>Browse the Book</div>
                </BrowseTheBook>
              </div>
            </Col>
          </Row>
        </TourRegion>
      </div>
    );
  }

}
