import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import BS from 'react-bootstrap';
import Router from 'react-router-dom';
import classnames from 'classnames';

import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';

import PlanFooter from '../footer';
import PlanMixin from '../plan-mixin';
import TaskPlanBuilder from '../builder';

const EventPlan = createReactClass({
  displayName: 'EventPlan',
  mixins: [PlanMixin],

  render() {
    const { id, courseId } = this.props;
    const builderProps = _.pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();

    const plan = TaskPlanStore.get(id);

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
        <BS.Panel className={formClasses} footer={footer} header={header}>
          <BS.Grid fluid={true}>
            <TaskPlanBuilder courseId={courseId} id={id} label="Event" {...builderProps} />
          </BS.Grid>
        </BS.Panel>
      </div>
    );
  },
});

export { EventPlan };
