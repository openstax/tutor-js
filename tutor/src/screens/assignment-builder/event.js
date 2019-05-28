import React from 'react';
import { idType } from 'shared';
import createReactClass from 'create-react-class';
import { Card } from 'react-bootstrap';
import { pick } from 'lodash';
import classnames from 'classnames';
import PlanFooter from './footer';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import Wrapper from './wrapper';

const EventPlan = createReactClass({
  displayName: 'EventPlan',
  mixins: [PlanMixin],

  propTypes: {
    id: idType.isRequired,
    courseId: idType.isRequired,
  },

  render() {
    const { id, courseId } = this.props;
    const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();

    const formClasses = classnames('edit-event', 'dialog',
      { 'is-invalid-form': hasError });

    return (
      <Wrapper planType="event">
        <Card className={formClasses}>
          <Card.Header>
            {this.builderHeader('event')}
          </Card.Header>
          <Card.Body>
            <TaskPlanBuilder
              id={id}
              courseId={courseId}
              label="Event" {...builderProps}
            />
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
      </Wrapper>
    );
  },
});

export { EventPlan };
const EventShell = PlanMixin.makePlanRenderer('event', EventPlan);
export default EventShell;
