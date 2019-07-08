import { React, PropTypes, observer } from '../../../helpers/react';
import TourAnchor from '../../../components/tours/anchor';
import TaskPlanHelper from '../../../helpers/task-plan';
import TutorLink from '../../../components/link';

const BackButton = observer(({ ux: { course, isEditable } }) => {
  if (isEditable) { return null; }

  return (
    <TourAnchor id="builder-back-button">
      <TutorLink {...TaskPlanHelper.calendarParams(course)} className="btn btn-default">
        Back to Calendar
      </TutorLink>
    </TourAnchor>
  );
});
BackButton.displayName = 'BackButton';
BackButton.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default BackButton;
