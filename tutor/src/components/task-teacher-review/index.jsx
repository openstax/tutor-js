import React from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { computed, observable, action } from 'mobx';
import { first, find } from 'lodash';
import TeacherTaskPlans from '../../models/teacher-task-plans';
import Courses from '../../models/courses-map';
import Breadcrumbs from './breadcrumbs';
import Stats from '../plan-stats';
import Review from './review';
import { PinnedHeaderFooterCard } from 'shared';
import ScrollTo from '../../models/scroll-to';

@observer
export default class TaskTeacherReview extends React.Component {
  static propTypes = {
    id: React.PropTypes.string,
    params: React.PropTypes.shape({
      id: React.PropTypes.string,
      courseId: React.PropTypes.string,
    }).isRequired,
    windowImpl: React.PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object,
  };

  @computed get taskPlan() {
    return TeacherTaskPlans
      .forCourseId(this.props.params.courseId)
      .withPlanId(this.props.params.id);
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  scroller = new ScrollTo({
    windowImpl: this.props.windowImpl,
  })

  @observable period = first(this.course.periods);

  @action.bound setPeriod(period) {
    this.period = period;
  }

  @computed get stats() {
    return find(this.taskPlan.analytics.stats, { period_id: this.period.id });
  }

  componentWillMount() {
    this.taskPlan.fetch().then(() =>
      this.taskPlan.analytics.fetchReview(),
    );
  }

  @action.bound scrollToStep(currentStep) {
    const stepSelector = `[data-section='${currentStep}']`;
    this.scroller.scrollToSelector(
      stepSelector, { updateHistory: false, unlessInView: false, scrollTopOffset: 180 },
    );
  }

  renderBreadcrumbs() {
    if (!this.stats) { return null; }
    return (
      <Breadcrumbs
        stats={this.stats}
        taskPlan={this.taskPlan}
        courseId={this.course.id}
        goToStep={this.goToStep}
        scrollToStep={this.scrollToStep}
      />
    );
  }

  renderReviewPanel() {
    if (!this.stats) { return null; }
    return (
      <Review
        goToStep={this.goToStep}
        stats={this.stats}
        period={this.period} />
    );
  }

  render() {
    const { period, props: { params: { courseId } } } = this;

    return (
      <PinnedHeaderFooterCard
        className={`task-teacher-review task-${this.taskPlan.type}`}
        fixedOffset={0}
        header={this.renderBreadcrumbs()}
        cardType="task"
      >
        <Grid fluid={true}>
          <Row>
            <Col sm={8}>
              {this.renderReviewPanel()}
            </Col>
            <Col sm={4}>
              <Stats
                plan={this.taskPlan}
                courseId={courseId}
                initialActivePeriodInfo={period}
                shouldOverflowData={true}
                handlePeriodSelect={this.setPeriod}
              />
            </Col>
          </Row>
        </Grid>
      </PinnedHeaderFooterCard>
    );
  }
}
