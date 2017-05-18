import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { Modal } from 'react-bootstrap';
import { get } from 'lodash';

import previewOnlyWarning from './preview-only-warning';

@observer
export default class CoursePreviewNags extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  render() {
    const NagComponent = get(this.props, 'ux.nagComponent');

    if (!NagComponent) {
      return null;
    }

    return (
      <Modal show={true} onHide={this.onClose} className="preview-warning-modal">
        <NagComponent ux={this.props.ux} />
      </Modal>
    );
  }


}
