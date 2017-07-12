import React from 'react';
import { Row, Col } from 'react-bootstrap';

import { includes } from 'lodash';

import UpcomingPanel from './upcoming-panel';
import AllEventsByWeek from './all-events-by-week';
import ThisWeekPanel from './this-week-panel';

import ProgressGuideShell from './progress-guide';
import BrowseTheBook from '../buttons/browse-the-book';
import CourseTitleBanner from '../course-title-banner';

import Courses from '../../models/courses-map';
import Tabs from '../tabs';
import { NotificationsBar } from 'shared';
import NotificationHelpers from '../../helpers/notifications';
import TourRegion from '../tours/region';

export default class StudentDashboard extends React.PureComponent {

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    params: React.PropTypes.object.isRequired,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: React.PropTypes.object,
  }

  state = {  tabIndex: 0 };

  onTabSelection(tabIndex, ev) {
    if (includes([0, 1], tabIndex)) {
      return (
        this.setState({ tabIndex })
      );
    } else {
      return (
        ev.preventDefault()
      );
    }
  }

  renderPastWork(course) {
    return (
      <div className="tab-pane active">
        <AllEventsByWeek courseId={course.id} isCollege={course.is_college} />
      </div>
    );
  }

  renderThisWeek(course) {
    return (
      <div className="tab-pane active">
        <ThisWeekPanel courseId={course.id} isCollege={course.is_college} />
        <UpcomingPanel courseId={course.id} isCollege={course.is_college} />
      </div>
    );
  }

  render() {
    const { courseId } = this.props;
    const course = Courses.get(courseId);

    return (
      <div className="dashboard">
        <NotificationsBar
          role={course.primaryRole.serialize()}
          course={course.serialize()}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={courseId} />
        <TourRegion courseId={courseId} id="student-dashboard" className="container">
          <Row>
            <Col xs={12} md={8} lg={9}>
              <Tabs
                params={this.props.params}
                onSelect={this.onTabSelection}
                tabs={['This Week', 'All Past Work']} />
              {this.state.tabIndex === 0 ? this.renderThisWeek(course) : this.renderPastWork(course)}
            </Col>
            <Col xs={12} md={4} lg={3}>
              <ProgressGuideShell courseId={courseId} />
              <div className="actions-box">
                <BrowseTheBook
                  unstyled={true}
                  courseId={courseId}
                  data-appearance={Courses.get(courseId).appearance_code}>
                  <div>
                    Browse the Book
                  </div>
                </BrowseTheBook>
              </div>
            </Col>
          </Row>
        </TourRegion>
      </div>
    );
  }

}
