import React from 'react';
import createReactClass from 'create-react-class';
import { pick, isEmpty } from 'lodash';
import { idType } from 'shared';
import { Card, Row, Col, Button } from 'react-bootstrap';
import classnames from 'classnames';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import ChooseExercises from './homework/choose-exercises';
import ReviewExercises from './homework/review-exercises';
import FeedbackSetting from './feedback';
import PlanFooter from './footer';
import { TaskPlanStore } from '../../flux/task-plan';

const HomeworkPlan = createReactClass({
  displayName: 'HomeworkPlan',
  mixins: [PlanMixin],

  propTypes: {
    id: idType.isRequired,
    courseId: idType.isRequired,
  },

  render() {
    const { id, courseId } = this.props;
    const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();
    const course = this.getCourse();

    const ecosystemId = TaskPlanStore.getEcosystemId(id, courseId);

    const topics = TaskPlanStore.getTopics(id);
    const hasExercises = !isEmpty(TaskPlanStore.getExercises(id));

    const formClasses = classnames(
      'edit-homework dialog',
      {
        hide: this.state.showSectionTopics,
        'is-invalid-form': hasError,
      },
    );

    return (
      <div className="homework-plan task-plan" data-assignment-type="homework">
        <Card className={formClasses}>
          <Card.Header>
            {this.builderHeader('homework')}
          </Card.Header>
          <Card.Body>
            <TaskPlanBuilder courseId={courseId} id={id} {...builderProps} />
            <Row>
              <Col xs={8}>
                <FeedbackSetting id={id} showPopup={this.state.isVisibleToStudents} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                {!this.state.isVisibleToStudents && (
                  <Button
                    id="problems-select"
                    className={classnames('-select-sections-btn', { 'invalid': hasError && !hasExercises })}
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
            id={id}
            courseId={courseId}
            onPublish={this.publish}
            onSave={this.save}
            onCancel={this.cancel}
            hasError={hasError}
            isVisibleToStudents={this.state.isVisibleToStudents}
            getBackToCalendarParams={this.getBackToCalendarParams}
            goBackToCalendar={this.goBackToCalendar}
          />
        </Card>
        {this.state.showSectionTopics && (
          <ChooseExercises
            course={course}
            planId={id}
            cancel={this.cancelSelection}
            hide={this.hideSectionTopics}
            canEdit={!this.state.isVisibleToStudents}
          />)}
        {hasExercises && !this.state.showSectionTopics && (
          <ReviewExercises
            course={course}
            canAdd={!this.state.isVisibleToStudents}
            canEdit={!this.state.isVisibleToStudents}
            showSectionTopics={this.showSectionTopics}
            courseId={courseId}
            sectionIds={topics}
            ecosystemId={ecosystemId}
            planId={id}
          />)}
      </div>
    );
  },
});

export { HomeworkPlan };
const HomeworkShell = PlanMixin.makePlanRenderer('homework', HomeworkPlan);
export default HomeworkShell;
