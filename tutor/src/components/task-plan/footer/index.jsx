import React from 'react';

import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import { PlanPublishStore } from '../../../flux/plan-publish';
import PlanHelper from '../../../helpers/plan';

import HelpTooltip from './help-tooltip';
import SaveButton from './save-button';
import CancelButton from './cancel-button';
import BackButton from './back-button';
import DraftButton from './save-as-draft';
import DeleteLink from './delete-link';

import TourAnchor from '../../tours/anchor';

export default class PlanFooter extends React.PureComponent {

  static propTypes = {
    id:               React.PropTypes.string.isRequired,
    courseId:         React.PropTypes.string.isRequired,
    hasError:         React.PropTypes.bool.isRequired,
    goBackToCalendar: React.PropTypes.func.isRequired,
    isVisibleToStudents: React.PropTypes.bool,
    getBackToCalendarParams: React.PropTypes.func,
  }

  static defaultProps = {
    isVisibleToStudents: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditable: TaskPlanStore.isEditable(this.props.id),
      publishing: TaskPlanStore.isPublishing(this.props.id),
      saving: TaskPlanStore.isSaving(this.props.id),
    };
  }

  componentWillMount() {
    const plan = TaskPlanStore.get(this.props.id);
    const publishState = PlanHelper.subscribeToPublishing(plan, this.checkPublishingStatus);
    this.setState({ publishing: publishState.isPublishing });
  }

  checkPublishingStatus(published) {
    const planId = this.props.id;
    if (published.for === planId) {
      const planStatus =
        { publishing: PlanPublishStore.isPublishing(planId) };

      this.setState(planStatus);
      if (PlanPublishStore.isDone(planId)) {
        PlanPublishStore.removeAllListeners(`progress.${planId}.*`, this.checkPublishingStatus);
        TaskPlanActions.load(planId);
      }
    }
  }

  saved() {
    TaskPlanStore.removeChangeListener(this.saved);
    this.props.goBackToCalendar();
  }

  onDelete() {
    const { id } = this.props;
    TaskPlanActions.delete(id);
    this.props.goBackToCalendar();
  }

  onSave() {
    const saving = this.props.onSave();
    this.setState({ saving, publishing: false });
  }

  onPublish() {
    const publishing = this.props.onPublish();
    this.setState({ publishing, saving: false, isEditable: TaskPlanStore.isEditable(this.props.id) });
  }

  render() {
    const { id, hasError } = this.props;
    const plan = TaskPlanStore.get(id);
    const isWaiting   = TaskPlanStore.isSaving(id) || TaskPlanStore.isPublishing(id) || TaskPlanStore.isDeleteRequested(id);
    const isFailed    = TaskPlanStore.isFailed(id);
    const isPublished = TaskPlanStore.isPublished(id);

    return (

      <div className="builder-footer-controls">
        <TourAnchor id="builder-save-button">
          <SaveButton
            onSave={this.onSave}
            onPublish={this.onPublish}
            isWaiting={isWaiting}
            isSaving={this.state.saving}
            isEditable={this.state.isEditable}
            isPublishing={this.state.publishing}
            isPublished={isPublished}
            isFailed={isFailed}
            hasError={hasError} />
        </TourAnchor>
        <TourAnchor id="builder-draft-button">
          <DraftButton
            onClick={this.onSave}
            isWaiting={isWaiting && this.state.saving}
            isPublishing={this.state.publishing}
            isFailed={isFailed}
            hasError={hasError}
            isPublished={isPublished} />
        </TourAnchor>
        <TourAnchor id="builder-cancel-button">
          <CancelButton
            isWaiting={isWaiting}
            onClick={this.props.onCancel}
            isEditable={this.state.isEditable} />
        </TourAnchor>
        <TourAnchor id="builder-back-button">
          <BackButton
            isEditable={this.state.isEditable}
            getBackToCalendarParams={this.props.getBackToCalendarParams} />
        </TourAnchor>
        <HelpTooltip isPublished={isPublished} />
        <TourAnchor id="builder-delete-button">
          <DeleteLink
            isNew={TaskPlanStore.isNew(id)}
            onClick={this.onDelete}
            isFailed={isFailed}
            isVisibleToStudents={this.props.isVisibleToStudents}
            isWaiting={TaskPlanStore.isDeleting(id)}
            isPublished={isPublished} />
        </TourAnchor>
      </div>
    );
  }
}
