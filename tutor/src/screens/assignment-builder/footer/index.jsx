import PropTypes from 'prop-types';
import React from 'react';
import { idType } from 'shared';
import { action } from 'mobx';
import { observer } from 'mobx-react';
import { TaskPlanStore, TaskPlanActions } from '../../../flux/task-plan';
import PlanPublishing from '../../../models/jobs/task-plan-publish';
import HelpTooltip from './help-tooltip';
import SaveButton from './save-button';
import CancelButton from './cancel-button';
import BackButton from './back-button';
import DraftButton from './save-as-draft';
import DeleteLink from './delete-link';
import PreviewButton from './preview-button';
import Courses from '../../../models/courses-map';
import TourAnchor from '../../../components/tours/anchor';

export default
@observer
class PlanFooter extends React.Component {

  static propTypes = {
    id:               idType.isRequired,
    courseId:         idType.isRequired,
    hasError:         PropTypes.bool.isRequired,
    onSave:           PropTypes.func.isRequired,
    onPublish:        PropTypes.func.isRequired,
    goBackToCalendar: PropTypes.func.isRequired,
    isVisibleToStudents: PropTypes.bool,
    getBackToCalendarParams: PropTypes.func,
  }

  static defaultProps = {
    isVisibleToStudents: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      isEditable: TaskPlanStore.isEditable(this.props.id),
      saving: TaskPlanStore.isSaving(this.props.id),
    };
  }

  @action.bound
  onDelete() {
    const { courseId, id } = this.props;
    Courses.get(courseId).teacherTaskPlans.get(id).is_deleting = true;
    TaskPlanActions.delete(id);
    this.props.goBackToCalendar();
  }

  @action.bound
  onSave() {
    const saving = this.props.onSave();
    this.setState({ saving });
  }

  @action.bound
  onPublish() {
    this.props.onPublish();
    this.setState({ saving: false, isEditable: TaskPlanStore.isEditable(this.props.id) });
  }

  render() {
    const { id, hasError } = this.props;
    const publishing  = PlanPublishing.isPublishing({ id });
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
            isPublishing={publishing}
            isPublished={isPublished}
            isFailed={isFailed}
            hasError={hasError} />
        </TourAnchor>
        <TourAnchor id="builder-draft-button">
          <DraftButton
            onClick={this.onSave}
            isWaiting={isWaiting && this.state.saving}
            isPublishing={publishing}
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
        <TourAnchor id="builder-delete-button">
          <DeleteLink
            isNew={TaskPlanStore.isNew(id)}
            onClick={this.onDelete}
            isFailed={isFailed}
            isVisibleToStudents={this.props.isVisibleToStudents}
            isWaiting={TaskPlanStore.isDeleting(id)}
            isPublished={isPublished} />
        </TourAnchor>

        <HelpTooltip isPublished={isPublished} />

        <div className="spacer" />

        <PreviewButton
          planType={TaskPlanStore.get(id).type}
          isWaiting={isWaiting}
          isNew={TaskPlanStore.isNew(id)}
          courseId={this.props.courseId}
        />
      </div>
    );
  }
};
