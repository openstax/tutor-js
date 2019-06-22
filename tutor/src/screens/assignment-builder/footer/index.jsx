import { React, PropTypes, observer } from '../../../helpers/react';
import UX from '../ux';
import SaveButton from './save-button';

const PlanFooter = observer(({ ux }) => {

  return (
    <div className="builder-footer-controls">
      <SaveButton ux={ux} />


    </div>
  );
});

PlanFooter.displayName = 'PlanFooter';
PlanFooter.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
};

export default PlanFooter;

// <TourAnchor id="builder-draft-button">
// <DraftButton
// onClick={ux.onSaveDraft}
// isBusy={ux.isSaving}
// isDisabled={ux.isSaving}
// />
// </TourAnchor>
// <TourAnchor id="builder-cancel-button">
// <CancelButton
// onClick={ux.onCancel}
// isDisabled={ux.isSaving}
// />
// </TourAnchor>
// <TourAnchor id="builder-back-button">
// <BackButton onClick={ux.onCancel} />
// </TourAnchor>
// <TourAnchor id="builder-delete-button">
// <DeleteLink ux={ux} />
// </TourAnchor>
//
// <HelpTooltip isPublished={isPublished} />
//
// <div className="spacer" />
//
// <PreviewButton ux={ux} />
