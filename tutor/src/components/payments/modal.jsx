import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { delay } from 'lodash';
import { autobind } from 'core-decorators';
import User from '../../models/user';
import Courses from '../../models/courses-map';
import Panel from './panel';
import OXFancyLoader from '../ox-fancy-loader';

import Payments from '../../models/payments';

@observer
export default class PaymentsModal extends React.PureComponent {
  static propTypes = {
    course: MobxPropTypes.observableObject.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onPaymentComplete: React.PropTypes.func.isRequired,
  }

  render() {

    return (
      <Modal show className="payments">
        <Panel {...this.props} />
      </Modal>
    );
  }


}
