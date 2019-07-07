import { React, PropTypes, observer } from '../../../helpers/react';
import TourAnchor from '../../../components/tours/anchor';
import { AsyncButton } from 'shared';

const SaveAsDraftButton = observer(({ ux, ux: { plan } }) => {
  if (plan.isPublished) { return null; }

  return (
    <TourAnchor id="builder-save-button">
      <AsyncButton
        variant="primary"
        className="publish"
        isWaiting={ux.isSaving}
        onClick={ux.onSaveAsDraft}
        waitingText="Saving…"
        disabled={!ux.canSave}
      >
        Save as Draft
      </AsyncButton>
    </TourAnchor>
  );
});
SaveAsDraftButton.displayName = 'SaveAsDraftButton';
SaveAsDraftButton.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default SaveAsDraftButton;
