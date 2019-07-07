import { React, PropTypes, observer } from '../../../helpers/react';
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

// import PropTypes from 'prop-types';
// import React from 'react';
//
// export default class CancelButton extends React.Component {
//
//   static propTypes = {
//     onClick:    PropTypes.func.isRequired,
//     isWaiting:  PropTypes.bool.isRequired,
//     isEditable: PropTypes.bool.isRequired,
//   }
//
//   render() {
//     if (!this.props.isEditable) { return null; }
//
//     return (
//       <Button
//         variant="default"
//         disabled={this.props.isWaiting}
//         onClick={this.props.onClick}
//       >
//         Cancel
//       </Button>
//     );
//   }
// }
