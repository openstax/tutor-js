import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { isEmpty, find } from 'lodash';
import { Card } from 'react-bootstrap';
import Course from '../../models/course';
import { SmartOverflow } from 'shared';
import CoursePeriodsNav from '../course-periods-nav';
import CourseBar from './course-bar';
import { ChaptersPerformance, PracticesPerformance } from './performances';
import TeacherTaskPlan from '../../models/task-plans/teacher/plan';
import LoadingScreen from 'shared/components/loading-animation';
import NoStudents from './no-students';

export default
@observer
class Stats extends React.Component {

  static propTypes = {
    plan: PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
    activeSection: PropTypes.string,
    initialActivePeriodIndex: PropTypes.number,
    handlePeriodSelect: PropTypes.func,
    shouldOverflowData: PropTypes.bool,
  };

  static defaultProps = {
    initialActivePeriodIndex: 0,
    shouldOverflowData: false,
  };

  @observable currentPeriodIndex = 0;

  @computed get course() {
    return this.props.course;
  }

  @computed get analytics() {
    return this.props.plan.analytics;
  }

  @computed get period() {
    return this.course.periods.sorted[this.currentPeriodIndex];
  }

  @computed get stats() {
    return find(this.analytics.stats, { period_id: this.period.id }) || {};
  }

  UNSAFE_componentWillMount() {
    if (!this.analytics.api.hasBeenFetched) {
      this.analytics.fetch();
    }
  }

  @action.bound handlePeriodSelect(period, index) {
    const { handlePeriodSelect } = this.props;
    this.currentPeriodIndex = index;
    if (handlePeriodSelect) { handlePeriodSelect(period); }
  }

  renderWrapped(body) {
    return (
      <Card className="task-stats">
        <Card.Body>
          <CoursePeriodsNav
            handleSelect={this.handlePeriodSelect}
            periods={this.course.periods}
            course={this.course}
          />
          {body}
        </Card.Body>
      </Card>
    );
  }

  renderCurrentPages() {
    if (isEmpty(this.stats.current_pages)) { return null; }
    return (
      <ChaptersPerformance
        currentPages={this.stats.current_pages}
        activeSection={this.props.activeSection} />
    );
  }

  renderSpacedPages() {
    if (isEmpty(this.stats.spaced_pages)) { return null; }
    return (
      <PracticesPerformance
        spacedPages={this.stats.spaced_pages}
        activeSection={this.props.activeSection} />
    );
  }

  render() {
    let courseBar, dataComponent;
    const { course, stats, props: { shouldOverflowData } } = this;

    if (!this.period.hasEnrollments) {
      return this.renderWrapped(<NoStudents courseId={course.id} />);
    }

    if (!this.analytics.api.hasBeenFetched) {
      return this.renderWrapped(<LoadingScreen />);
    }

    courseBar = <CourseBar data={stats} type={this.props.plan.type} />;

    if (shouldOverflowData) {
      dataComponent = <SmartOverflow className="task-stats-data" heightBuffer={24}>
        <section>
          {courseBar}
        </section>
        {this.renderCurrentPages()}
        {this.renderSpacedPages()}
      </SmartOverflow>;
    } else {
      dataComponent = <div className="task-stats-data">
        <section>
          {courseBar}
        </section>
        {this.renderCurrentPages()}
        {this.renderSpacedPages()}
      </div>;
    }

    return (
      <Card className="task-stats">
        <Card.Body>
          <CoursePeriodsNav
            handleSelect={this.handlePeriodSelect}
            periods={this.course.periods}
            course={this.course}
          />
          {dataComponent}
        </Card.Body>
      </Card>
    );
  }
}
