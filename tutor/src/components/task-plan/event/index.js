import React from 'react';
import { idType } from 'shared';
import createReactClass from 'create-react-class';
import { Panel, Grid } from 'react-bootstrap';
import { pick } from 'lodash';
import classnames from 'classnames';
import { TaskPlanStore  } from '../../../flux/task-plan';
import PlanFooter from '../footer';
import PlanMixin from '../plan-mixin';
import TaskPlanBuilder from '../builder';

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

    const footer = <PlanFooter
      id={id}
      courseId={courseId}
      onPublish={this.publish}
      onSave={this.save}
      onCancel={this.cancel}
      hasError={hasError}
      isVisibleToStudents={this.state.isVisibleToStudents}
      getBackToCalendarParams={this.getBackToCalendarParams}
      goBackToCalendar={this.goBackToCalendar} />;

    const header = this.builderHeader('event', '');

    const formClasses = classnames('edit-event', 'dialog',
      { 'is-invalid-form': hasError });

    return (
      <div className="event-plan task-plan" data-assignment-type="event">
        <Panel className={formClasses} footer={footer} header={header}>
          <Grid fluid={true}>
            <TaskPlanBuilder courseId={courseId} id={id} label="Event" {...builderProps} />
          </Grid>
        </Panel>
      </div>
    );
  },
});

export { EventPlan };
