import PropTypes from 'prop-types';
import React from 'react';
import { get } from 'lodash';
import { Row, Col, Card } from 'react-bootstrap';
import { action, observable } from 'mobx';
import { includes } from 'lodash';
import UpcomingCard from './upcoming-panel';
import AllEventsByWeek from './all-events-by-week';
import ThisWeekCard from './this-week-panel';
import ProgressGuideShell from './progress-guide';
import BrowseTheBook from '../../components/buttons/browse-the-book';
import CourseTitleBanner from '../../components/course-title-banner';

import Course from '../../models/course';
import Tabs from '../../components/tabs';
import { NotificationsBar } from 'shared';
import NotificationHelpers from '../../helpers/notifications';
import TourRegion from '../../components/tours/region';
import Surveys from './surveys';

export default class StudentDashboard extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    params: PropTypes.object.isRequired,
  }

  // router context is needed for Navbar helpers
  static contextTypes = {
    router: PropTypes.object,
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

  componentDidMount() {
    const { course } = this.props;
    const role = course.currentRole;
    if (role.isStudentLike && !get(course.userStudentRecord, 'mustPayImmediately')) {
      this.props.course.studentTaskPlans.fetch();
    }
  }

  renderPastWork(course) {
    return (
      <div className="tab-pane active" role="tabpanel">
        <AllEventsByWeek course={course} />
      </div>
    );
  }

  renderThisWeek(course) {
    return (
      <div className="tab-pane active" role="tabpanel">
        <ThisWeekCard course={course} />
        <UpcomingCard course={course} />
      </div>
    );
  }

  render() {
    const { tabIndex, props: { course } } = this;

    return (
      <div className="student-dashboard">
        <NotificationsBar
          role={course.primaryRole.serialize()}
          course={course.serialize()}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={course.id} />
        <TourRegion
          id="student-dashboard"
          otherTours={['about-late', 'assignment-progress']}
          courseId={course.id}
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
              <ProgressGuideShell courseId={course.id} />
              <Card className="actions-box browse-the-book">
                <BrowseTheBook
                  unstyled
                  course={course}
                  data-appearance={course.appearance_code}
                >
                  <div>Browse the Book</div>
                </BrowseTheBook>
              </Card>
            </Col>
          </Row>
        </TourRegion>
      </div>
    );
  }

}
