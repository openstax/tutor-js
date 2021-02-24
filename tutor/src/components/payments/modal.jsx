import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import Card from './panel';

@observer
export default
class PaymentsModal extends React.Component {
  static propTypes = {
      course: PropTypes.object.isRequired,
      onCancel: PropTypes.func.isRequired,
      onPaymentComplete: PropTypes.func.isRequired,
  }

  render() {

      return (
          <Modal show className="make-payment">
              <Card {...this.props} />
          </Modal>
      );
  }


}
