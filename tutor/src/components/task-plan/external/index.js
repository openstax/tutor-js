import React from 'react';
import createReactClass from 'create-react-class';
import _ from 'underscore';
import BS from 'react-bootstrap';
import Router from 'react-router-dom';
import validator from 'validator';
import classnames from 'classnames';

import { TutorInput, TutorDateInput, TutorTextArea } from '../../tutor-input';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { TaskingStore } from '../../../flux/tasking';

import PlanFooter from '../footer';
import PlanMixin from '../plan-mixin';
import TaskPlanBuilder from '../builder';

const ExternalPlan = createReactClass({
  displayName: 'ExternalPlan',
  mixins: [PlanMixin],

  setUrl(url) {
    const { id } = this.props;
    return TaskPlanActions.updateUrl(id, url);
  },

  validate(inputValue) {
    if ((inputValue == null) || (inputValue.length <= 0)) { return ['required']; }
    if (!validator.isURL(inputValue)) { return ['url']; }
  },

  render() {
    const { id, courseId } = this.props;
    const builderProps = _.pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();

    const plan = TaskPlanStore.get(id);
    const externalUrl = __guard__(plan != null ? plan.settings : undefined, x => x.external_url);

    let formClasses = ['edit-external', 'dialog'];

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

    const header = this.builderHeader('external');
    let label = 'Assignment URL';

    const isURLLocked = TaskingStore.isTaskOpened(id) && TaskPlanStore.isPublished(id);
    if (isURLLocked) { label = `${label} (Cannot be changed once assignment is opened and published)`; }

    formClasses = classnames(
      'edit-external',
      'dialog',
      {
        'is-invalid-form': hasError,
      },
    );

    return (
      <div className="external-plan task-plan" data-assignment-type="external">
        <BS.Panel className={formClasses} footer={footer} header={header}>
          <BS.Grid fluid={true}>
            <TaskPlanBuilder courseId={courseId} id={id} {...builderProps} />
            <BS.Row>
              <BS.Col xs={12} md={12}>
                <TutorInput
                  disabled={isURLLocked}
                  label={label}
                  className="external-url"
                  id="external-url"
                  default={externalUrl}
                  required={true}
                  validate={this.validate}
                  onChange={this.setUrl} />
              </BS.Col>
            </BS.Row>
          </BS.Grid>
        </BS.Panel>
      </div>
    );
  },
});

export { ExternalPlan };

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}