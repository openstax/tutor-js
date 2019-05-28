import { React, PropTypes, styled } from '../../../helpers/react';
import createReactClass from 'create-react-class';
import { Container, Col, Alert, Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import classnames from 'classnames';
import { camelCase } from 'lodash';
import TutorLink from '../../../components/link';
import TaskingDateTimes from '../builder/tasking-date-times';
import BindStoresMixin from '../../../components/bind-stores-mixin';
import { TutorInput } from '../../../components/tutor-input';
import { TaskingStore, TaskingActions } from '../../../flux/tasking';
import TimeHelper from '../../../helpers/time';
import taskPlanEditingInitialize from '../initialize-editing';
import PublishButton from '../footer/save-button';
import DraftButton from '../footer/save-as-draft';
import PlanMixin from '../plan-mixin';
import ServerErrorHandlers from '../../../components/error-monitoring/handlers';
import Course from '../../../models/course';
import NudgeIsAvailableMessage from '../nudge-is-available-message';

const StyledNudgeIsAvailableMessage = styled(NudgeIsAvailableMessage)`
  font-size: 14px;
  line-height: 20px;
  padding-left: 1.5rem;
`;

const TaskPlanMiniEditor = createReactClass({
  displayName: 'TaskPlanMiniEditor',

  propTypes: {
    course:       PropTypes.instanceOf(Course).isRequired,
    termStart:    TimeHelper.PropTypes.moment,
    termEnd:      TimeHelper.PropTypes.moment,
    id:           PropTypes.string.isRequired,
    onHide:       PropTypes.func.isRequired,
    handleError:  PropTypes.func.isRequired,
  },

  mixins: [PlanMixin, BindStoresMixin],

  getBindEvents() {
    const { id } = this.props;
    return {
      taskingChanged: {
        store: TaskingStore,
        listenTo: `taskings.${id}.*.changed`,
        callback: this.changeTaskPlan,
      },

      taskErrored: {
        store: TaskPlanStore,
        listenTo: 'errored',
        callback: this.setError,
      },
    };
  },

  changeTaskPlan() {
    const { id, course } = this.props;
    const plan = course.teacherTaskPlans.get(id);
    const taskings = TaskingStore.getChanged(id);
    plan.taskings = taskings;
    return TaskPlanActions.replaceTaskings(id, taskings);
  },

  setTitle(title) {
    const { id } = this.props;
    return TaskPlanActions.updateTitle(id, title);
  },

  setError(error) {
    this.props.handleError(error);
    return this.setState({ error });
  },

  initializePlan(props = this.props) {
    const { id, course, termStart, termEnd } = props;

    // make sure timezone is synced before working with plan
    const courseTimezone = course.time_zone;
    TimeHelper.syncCourseTimezone(courseTimezone);

    taskPlanEditingInitialize(id, course, { start: termStart, end: termEnd });
  },

  UNSAFE_componentWillMount() {
    this.initializePlan();
    return TaskingActions.updateTaskingsIsAll(this.props.id, true);
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    if ((this.props.id !== nextProps.id) ||
      (this.props.course !== nextProps.course)) {
      this.initializePlan(nextProps);
      TaskingActions.updateTaskingsIsAll(this.props.id, true);
    }
  },

  onSave() {
    const saving = this.save();
    return this.setState({ saving, publishing: false });
  },

  onPublish() {
    const publishing = this.publish();
    return this.setState({ saving: false, publishing });
  },

  afterSave(plan) {
    this.props.course.teacherTaskPlans.onPlanSave(this.props.id, plan);

    this.setState({ saving: false, publishing: false });
    return this.props.onHide();
  },

  onCancel() {
    this.props.onHide();
    if (TaskPlanStore.isNew(this.props.id)) {
      TaskPlanActions.removeUnsavedDraftPlan(this.props.id);
      this.props.course.teaherTaskPlans.delete(this.props.id);
    }
  },

  render() {
    let errorAttrs;
    const { id, course, termStart, termEnd } = this.props;
    const courseId = course.id;
    const hasError = this.hasError();
    const classes = classnames('task-plan-mini-editor',
      { 'is-invalid-form': hasError }
    );
    if (this.state.error) { errorAttrs = ServerErrorHandlers.forError(this.state.error); }
    const plan = TaskPlanStore.get(id);
    const isPublished = TaskPlanStore.isPublished(id);

    return (
      <div className={classes}>
        <StyledNudgeIsAvailableMessage planType={plan.type} />
        <Container>
          <div className="row">
            <Col xs={12}>
              <h4>
                Add Copied Assignment
              </h4>
            </Col>
          </div>
          <div className="row">
            <Col xs={12}>
              <TutorInput
                label="Title"
                className="assignment-name"
                id="reading-title"
                value={plan.title || ''}
                required={true}
                onChange={this.setTitle}
                disabled={this.state.error != null} />
            </Col>
          </div>
          <div className="row times">
            <TaskingDateTimes
              sizes={{}}
              id={plan.id}
              isEditable={this.state.error == null}
              courseId={courseId}
              termStart={termStart}
              termEnd={termEnd}
              taskingIdentifier="all" />
          </div>
          <div className="row">
            <Col xs={6}>
              Assigned to all sections
            </Col>
            <Col xs={6} className="text-right">
              <TutorLink to={camelCase(`edit-${plan.type}`)} params={{ id: plan.id, courseId }}>
                Edit other assignment details
              </TutorLink>
            </Col>
          </div>
          {errorAttrs && (
            <Alert variant="danger">
              <h3>
                {errorAttrs.title}
              </h3>
              {errorAttrs.body}
            </Alert>)}
        </Container>
        <div className="builder-footer-controls">
          <PublishButton
            size="small"
            onSave={this.onSave}
            onPublish={this.onPublish}
            isWaiting={!!(this.isWaiting() && this.state.publishing && isEmpty(this.state.error))}
            isSaving={!!this.state.saving}
            isEditable={!!this.state.isEditable}
            isPublishing={!!this.state.publishing}
            isPublished={isPublished}
            isFailed={false}
            hasError={hasError} />
          <DraftButton
            size="small"
            onClick={this.onSave}
            isWaiting={!!(this.isWaiting() && this.state.saving && isEmpty(this.state.error))}
            isFailed={TaskPlanStore.isFailed(id)}
            hasError={hasError}
            isPublished={isPublished}
            isPublishing={!!this.state.publishing} />
          <Button
            size="small"
            className="cancel"
            variant={(this.state.error != null) ? 'deault' : 'secondary'}
            onClick={this.onCancel}
            disabled={this.isWaiting() && (this.state.error == null)}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  },
});

export default TaskPlanMiniEditor;
