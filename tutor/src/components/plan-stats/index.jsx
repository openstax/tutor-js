import React from 'react';

import { observer } from 'mobx-react';
import { observable, computed, action } from 'mobx';
import { isEmpty, find } from 'lodash';
import { Panel } from 'react-bootstrap';
import Course from '../../models/course';
import { SmartOverflow } from 'shared';
import CoursePeriodsNav from '../course-periods-nav';
import CourseBar from './course-bar';
import { ChaptersPerformance, PracticesPerformance } from './performances';
import TeacherTaskPlan from '../../models/task-plan/teacher';
import LoadingScreen from '../loading-screen';
import NoStudents from './no-students';

@observer
export default class Stats extends React.PureComponent {

  static propTypes = {
    plan: React.PropTypes.instanceOf(TeacherTaskPlan).isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
    activeSection: React.PropTypes.string,
    initialActivePeriodIndex: React.PropTypes.number,
    handlePeriodSelect: React.PropTypes.func,
    shouldOverflowData: React.PropTypes.bool,
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

  componentWillMount() {
    this.analytics.fetch();
  }

  @action.bound handlePeriodSelect(period, index) {
    const { handlePeriodSelect } = this.props;
    this.currentPeriodIndex = index;
    if (handlePeriodSelect) { handlePeriodSelect(period); }
  }

  renderWrapped(body) {
    return (
      <Panel className="task-stats">
        <CoursePeriodsNav
          handleSelect={this.handlePeriodSelect}
          periods={this.course.periods}
          course={this.course}
        />
        {body}
      </Panel>
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
      <Panel className="task-stats">
        <CoursePeriodsNav
          handleSelect={this.handlePeriodSelect}
          periods={this.course.periods}
          course={this.course}
        />
        {dataComponent}
      </Panel>
    );
  }
}
