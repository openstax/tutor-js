import { React, PropTypes, observable, idType, observer, cn } from '../../helpers/react';
import { pick, isEmpty } from 'lodash';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Course from '../../models/course';
import Plan from '../../models/task-plans/teacher/plan';
import Header from './header';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import ChooseExercises from './homework/choose-exercises';
import ReviewExercises from './homework/review-exercises';
import FeedbackSetting from './feedback';
import PlanFooter from './footer';
import { TaskPlanStore } from '../../flux/task-plan';
import Wrapper from './wrapper';

@observer
class HomeworkPlan extends React.Component {

  static propTypes = {
    plan: PropTypes.instanceOf(Plan).isRequired,
  }

  @observable isShowingSectionTopics = false;

  render() {
    const { hasError, hasExercises } = this;
    const { plan, course } = this.props;

    // const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    // const hasError = this.hasError();
    // const course = this.getCourse();
    //
    // const ecosystemId = TaskPlanStore.getEcosystemId(id, courseId);
    //
    // const topics = TaskPlanStore.getTopics(id);
    // const hasExercises = !isEmpty(TaskPlanStore.getExercises(id));

    // const formClasses = cn(
    //   'edit-homework dialog',
    //   {
    //     hide: this.state.showSectionTopics,
    //     'is-invalid-form': hasError,
    //   },
    // );

    return (
      <Wrapper planType={plan.type}>
        <Card className={cn('edit-homework', 'dialog', {
          'is-invalid-form': plan.hasError,
          hide: this.isShowingSectionTopics,
        })}>

          <Header plan={plan} />

          <Card.Body>
            <TaskPlanBuilder plan={plan} course={course} />
            <Row>
              <Col xs={8}>
                <FeedbackSetting plan={plan} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                {!plan.isVisibleToStudents && (
                  <Button
                    id="problems-select"
                    className={cn('-select-sections-btn', {
                      'invalid': hasError && !hasExercises,
                    })}
                    onClick={this.showSectionTopics}
                    variant="default"
                  >+ Select Problems</Button>)}
                {hasError && !hasExercises && (
                  <span className="problems-required">
                    Please select problems for this assignment.
                  </span>)}
              </Col>
            </Row>
          </Card.Body>
          <PlanFooter
            plan={plan}
            course={course}
            onPublish={this.publish}
            onSave={this.save}
            onCancel={this.cancel}
            hasError={hasError}

            getBackToCalendarParams={this.getBackToCalendarParams}
            goBackToCalendar={this.goBackToCalendar}
          />
        </Card>
        {this.state.showSectionTopics && (
          <ChooseExercises
            course={course}
            plan={plan}
            cancel={this.cancelSelection}
            hide={this.hideSectionTopics}

          />)}
        {hasExercises && !this.state.showSectionTopics && (
          <ReviewExercises
            plan={plan}
            course={course}
            showSectionTopics={this.showSectionTopics}
            course={course}
            sectionIds={plan.settings.page_ids}
          />)}
      </Wrapper>
    );
  }
}

export { HomeworkPlan };
const HomeworkShell = PlanMixin.makePlanRenderer('homework', HomeworkPlan);
export default HomeworkShell;
