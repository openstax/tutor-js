import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';

@observer
export default class CourseNagModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  render() {
    const NagComponent = get(this.props, 'ux.nagComponent');

    if (!NagComponent) {
      return null;
    }

    return (
      <Modal show={true} onHide={this.onClose} className="onboarding">
        <NagComponent ux={this.props.ux} />
      </Modal>
    );
  }


}
