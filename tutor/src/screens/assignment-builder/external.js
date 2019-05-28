import React from 'react';
import createReactClass from 'create-react-class';
import { pick, get } from 'lodash';
import { Card, Row, Col } from 'react-bootstrap';
import { idType } from 'shared';
import validator from 'validator';
import classnames from 'classnames';
import { TutorInput } from '../../components/tutor-input';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import { TaskingStore } from '../../flux/tasking';
import PlanFooter from './footer';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import Wrapper from './wrapper';

const ExternalPlan = createReactClass({
  displayName: 'ExternalPlan',
  mixins: [PlanMixin],

  propTypes: {
    id: idType.isRequired,
    courseId: idType.isRequired,
  },

  setUrl(url) {
    const { id } = this.props;
    return TaskPlanActions.updateUrl(id, url);
  },

  validate(inputValue) {
    if ((inputValue == null) || (inputValue.length <= 0)) { return ['required']; }
    if (!validator.isURL(inputValue)) { return ['url']; }
    return null;
  },

  render() {
    const { id, courseId } = this.props;
    const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    const hasError = this.hasError();

    const plan = TaskPlanStore.get(id);
    const externalUrl = get(plan, 'settings.external_url');

    let formClasses = ['edit-external', 'dialog'];

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
    //.task-plan[data-assignment-type='reading'] .dialog > .card-header
    return (
      <Wrapper planType="external">
        <Card className={formClasses}>
          <Card.Header>
            {this.builderHeader('external')}
          </Card.Header>
          <Card.Body>
            <TaskPlanBuilder courseId={courseId} id={id} {...builderProps} />
            <Row>
              <Col xs={12} md={12}>
                <TutorInput
                  disabled={isURLLocked}
                  label={label}
                  className="external-url"
                  id="external-url"
                  default={externalUrl}
                  required={true}
                  validate={this.validate}
                  onChange={this.setUrl} />
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
      </Wrapper>
    );
  },
});

export { ExternalPlan };
const ExternalShell = PlanMixin.makePlanRenderer('external', ExternalPlan);
export default ExternalShell;
