import {
  React, PropTypes, observer, observable, computed, action, idType,
} from '../../helpers/react';
import { ScrollToTop } from 'shared';
import { Container, Row, Col } from 'react-bootstrap';
import { first, find } from 'lodash';
import Courses from '../../models/courses-map';
import Breadcrumbs from './breadcrumbs';
import Stats from '../../components/plan-stats';
import Review from './review';
import ScrollTo from '../../helpers/scroll-to';
import LoadingScreen from 'shared/components/loading-animation';

import './styles.scss';

export default
@observer
class TeacherReviewMetrics extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.string,
      courseId: idType,
    }).isRequired,
    windowImpl: PropTypes.object,
  };

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  // not computed since withPlanId will add a missing plan
  get taskPlan() {
    return this.course.teacherTaskPlans.withPlanId(this.props.params.id);
  }

  scroller = new ScrollTo({
    windowImpl: this.props.windowImpl,
  })

  @observable period = first(this.course.periods.sorted);

  @action.bound setPeriod(period) {
    this.period = period;
  }

  @computed get stats() {
    return find(this.taskPlan.analytics.stats, { period_id: this.period.id });
  }

  UNSAFE_componentWillMount() {
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

  renderReviewCard() {
    return (
      <Review
        goToStep={this.goToStep}
        course={this.course}
        stats={this.stats}
        period={this.period} />
    );
  }

  render() {
    const { course, period } = this;

    if (!this.taskPlan.analytics.api.hasBeenFetched) {
      return <LoadingScreen />;
    }

    return (
      <ScrollToTop>
        <div
          className={`task-teacher-review task-${this.taskPlan.type}`}
        >
          {this.renderBreadcrumbs()}
          <Container fluid={true} className="task-teacher-review">
            <Row>
              <Col sm={8}>
                {this.renderReviewCard()}
              </Col>
              <Col sm={4}>
                <Stats
                  plan={this.taskPlan}
                  course={course}
                  period={period}
                  shouldOverflowData={true}
                  handlePeriodSelect={this.setPeriod}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </ScrollToTop>
    );
  }
}
