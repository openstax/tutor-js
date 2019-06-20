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
import Plan from '../../../models/task-plans/teacher/plan';

export default
@observer
class PlanFooter extends React.Component {

  static propTypes = {
    plan:             PropTypes.instanceOf(Plan).isRequired,
    hasError:         PropTypes.bool.isRequired,
    onSave:           PropTypes.func.isRequired,
    onPublish:        PropTypes.func.isRequired,
    isVisibleToStudents: PropTypes.bool,
    getBackToCalendarParams: PropTypes.func,
  }

  static defaultProps = {
    isVisibleToStudents: false,
  }


  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isEditable: TaskPlanStore.isEditable(this.props.id),
  //     saving: TaskPlanStore.isSaving(this.props.id),
  //   };
  // }

  @action.bound
  async onDelete() {
    const { plan } = this.props;
    await plan.delete();
    this.props.onSave();
  }

  // @action.bound
  // onSave() {
  //   this.props.onSave();
  // }

  // @action.bound
  // onPublish() {
  //   this.props.onPublish();
  //   this.setState({ saving: false, isEditable: TaskPlanStore.isEditable(this.props.id) });
  // }

  render() {
    const { plan, course, hasError, onSave, onPublish, onCancel } = this.props;
    const isSaving = false;
    const isPublishing  = false; // plan.api.PlanPublishing.isPublishing({ id });
    const isWaiting   = false; // TaskPlanStore.isSaving(id) || TaskPlanStore.isPublishing(id) || TaskPlanStore.isDeleteRequested(id);
    const isFailed    = false; // TaskPlanStore.isFailed(id);
    const isPublished = false; // TaskPlanStore.isPublished(id);

    return (
      <div className="builder-footer-controls">
        <TourAnchor id="builder-save-button">
          <SaveButton
            onSave={onSave}
            onPublish={onPublish}
            isWaiting={isWaiting}
            isSaving={isSaving}
            isEditable={!isSaving}
            isPublishing={isPublishing}
            isPublished={isPublished}
            isFailed={isFailed}
            hasError={hasError} />
        </TourAnchor>
        <TourAnchor id="builder-draft-button">
          <DraftButton
            onClick={onSave}
            isWaiting={isWaiting && !isPublishing}
            isPublishing={isPublishing}
            isFailed={isFailed}
            hasError={hasError}
            isPublished={isPublished} />
        </TourAnchor>
        <TourAnchor id="builder-cancel-button">
          <CancelButton
            isWaiting={isWaiting}
            onClick={onCancel}
            isEditable={plan.isEditable} />
        </TourAnchor>
        <TourAnchor id="builder-back-button">
          <BackButton isEditable={plan.isEditable} course={course} />
        </TourAnchor>
        <TourAnchor id="builder-delete-button">
          <DeleteLink
            plan={plan}
            onClick={onSave}
            isFailed={isFailed}
            isVisibleToStudents={plan.isVisibleToStudents}
            isWaiting={isWaiting}
            isPublished={isPublished} />
        </TourAnchor>

        <HelpTooltip isPublished={isPublished} />

        <div className="spacer" />

        <PreviewButton
          planType={plan.type}
          isWaiting={isWaiting}
          isNew={plan.isNew}
          courseId={course.id}
        />
      </div>
    );
  }
}
