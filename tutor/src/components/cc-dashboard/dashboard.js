import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';
import TutorLink from '../link';

import Courses from '../../models/courses-map';

import { NotificationsBar } from 'shared';
import { CCDashboardStore } from '../../flux/cc-dashboard';
import CoursePeriodsNav from '../course-periods-nav';

import Icon from '../icon';
import DashboardChapter from './chapter';
import EmptyPeriod from './empty-period';
import CourseTitleBanner from '../course-title-banner';
import NotificationHelpers from '../../helpers/notifications';

const TOOLTIPS = {
  complete: `\
Complete shows the percentage of students who
have completed the Concept Coach for this section.
Students who have not answered all of the Concept Coach
questions for this section will not be counted, although
the questions they have answered will be included in the
Original and Spaced Practice Performance percentages.\
`,

  original: `\
The original performance shows the percentage of Concept Coach
questions that students answered correctly on this section of the
book the first time they were presented. The performance bars
show up for a section of the book once at least 10% of students
in the class (or section) have submitted answers.\
`,

  spaced: `\
Spaced practice performance shows the percentage of Concept Coach
questions on this section that were correctly answered after the
section was originally practiced. Compare this measure to
Original Performance to gauge how well students are retaining
the information.\
`,
};

class CCDashboard extends React.Component {
  // router context is needed for Navbar helpers
  static contextTypes = {
    router: PropTypes.object,
  };

  static defaultProps = { initialActivePeriod: 0 };

  static propTypes = {
    courseId: PropTypes.string,
  };

  constructor(props) {
    super(props);
    const activePeriod = __guard__(CCDashboardStore.getPeriods(props.courseId), x => x[props.initialActivePeriod]);
    this.state = { activePeriodId: (activePeriod != null ? activePeriod.id : undefined) };
  }

  handlePeriodSelect = (period) => {
    return this.setState({ activePeriodId: period.id });
  };

  render() {
    const { courseId } = this.props;
    const periods = CCDashboardStore.getPeriods(courseId);
    const chapters = CCDashboardStore.chaptersForDisplay(courseId, this.state.activePeriodId);

    const course = Courses.get(courseId);
    const emptyPeriod = chapters.length === 0;
    const emptyGraphic = <EmptyPeriod courseId={courseId} />;

    const dashboardResults =
      <div className="results">
        <BS.Row className="column-legend">
          <BS.Col xs={2} xsOffset={6}>
            <span className="title">
              {'Complete\
  '}
              <Icon
                type="info-circle"
                tooltipProps={{ placement: 'top' }}
                tooltip={TOOLTIPS.complete} />
            </span>
          </BS.Col>
          <BS.Col xs={2}>
            <span className="title">
              {'Original\
  '}
              <Icon
                type="info-circle"
                tooltipProps={{ placement: 'top' }}
                tooltip={TOOLTIPS.original} />
            </span>
          </BS.Col>
          <BS.Col xs={2}>
            <span className="title">
              {'Spaced Practice\
  '}
              <Icon
                type="info-circle"
                tooltipProps={{ placement: 'top' }}
                tooltip={TOOLTIPS.spaced} />
            </span>
          </BS.Col>
        </BS.Row>
        {chapters.map((chapter, index) =>
          <DashboardChapter id={chapter.id} chapter={chapter} key={index} />)}
        <BS.Row>
          <BS.Col className="hide-section-legend" xs={12}>
            {'\
  Chapters and sections that have not been worked are hidden\
  '}
          </BS.Col>
        </BS.Row>
      </div>;


    return (
      <div className="cc-dashboard" data-period={this.state.activePeriodId}>
        <NotificationsBar
          course={course}
          role={course.primaryRole}
          callbacks={NotificationHelpers.buildCallbackHandlers(this)} />
        <CourseTitleBanner courseId={courseId} />
        <BS.Panel>
          <h2>
            <span>
              Class Dashboard
            </span>
            <TutorLink
              className="detailed-scores btn btn-default"
              to="viewScores"
              params={{ courseId }}>
              {'\
    View Detailed Scores\
    '}
            </TutorLink>
          </h2>
          <CoursePeriodsNav
            handleSelect={this.handlePeriodSelect}
            initialActive={this.props.initialActivePeriod}
            periods={periods}
            courseId={courseId} />
          {emptyPeriod ? emptyGraphic : dashboardResults}
        </BS.Panel>
      </div>
    );
  }
}

export default CCDashboard;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}