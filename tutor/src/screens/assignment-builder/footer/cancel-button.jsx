import { React, PropTypes, observer } from 'vendor';
import TourAnchor from '../../../components/tours/anchor';
import { Button } from 'react-bootstrap';

const CancelButton = observer(({ ux }) => {

  return (
    <TourAnchor id="builder-cancel-button">
      <Button
        variant="default"
        disabled={ux.isSaving}
        onClick={ux.onCancel}
      >
        Cancel
      </Button>
    </TourAnchor>
  );
});
CancelButton.displayName = 'CancelButton';
CancelButton.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default CancelButton;
