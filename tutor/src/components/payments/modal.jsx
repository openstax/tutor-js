import MobxPropTypes from 'prop-types';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { delay } from 'lodash';
import { autobind } from 'core-decorators';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import Panel from './panel';
import OXFancyLoader from '../ox-fancy-loader';

import Payments from '../../models/payments';

export default
@observer
class PaymentsModal extends React.Component {
  static propTypes = {
    course: MobxPropTypes.observableObject.isRequired,
    onCancel: MobxPropTypes.func.isRequired,
    onPaymentComplete: MobxPropTypes.func.isRequired,
  }

  render() {

    return (
      <Modal show className="make-payment">
        <Panel {...this.props} />
      </Modal>
    );
  }


};
