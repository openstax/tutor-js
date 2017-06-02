import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';

@observer
export default class CourseNagModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  @action.bound
  onDismiss() { this.isDismissed = true; }

  @observable isDismissed = false

  render() {
    const NagComponent = get(this.props, 'ux.nagComponent');

    if (!NagComponent || this.isDismissed) {
      return null;
    }

    return (
      <Modal
        show={!this.isDismissed}
        onHide={this.onClose}
        className="onboarding"
      >
        <NagComponent
          onDismiss={this.onDismiss}
          ux={this.props.ux}
        />
      </Modal>
    );
  }


}
