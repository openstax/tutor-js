import PropTypes from 'prop-types';
import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import TutorDialog from './tutor-dialog';

import { CloseButton } from 'shared';

/*
<Dialog
  className='my-dialog-class'
  header='Dialog Title'
  confirmMsg='Are you sure you want to close?'
  isChanged={-> true}
  onCancel={-> alert 'Cancelling'}
  >
  body text
</Dialog>
*/

export default class extends React.Component {
  static displayName = 'Dialog';

  static propTypes = {
    header: PropTypes.node.isRequired,
    onCancel: PropTypes.func.isRequired,
    isChanged: PropTypes.func,
    confirmMsg: PropTypes.string,
    footer: PropTypes.node,
    cancel: PropTypes.any,
    primary: PropTypes.node,
    onPrimary: PropTypes.func,
  };

  onCancel = () => {
    const { isChanged, confirmMsg, onCancel } = this.props;
    if ((typeof isChanged === 'function' ? isChanged() : undefined) && confirmMsg) {
      return TutorDialog.show({
        title: 'Unsaved Changes',
        body: confirmMsg,
      }).then( () => onCancel());
    } else {
      return onCancel();
    }
  };

  render() {
    let cancelBtn;
    let { className, header, footer, primary, cancel, isChanged } = this.props;

    if (cancel) {
      cancelBtn = <Button key="cancel" onClick={this.onCancel}>
        {cancel}
      </Button>;
    }

    const closeBtn = <CloseButton key="close" onClick={this.onCancel} />;
    header = [header, closeBtn];
    if (footer || primary || cancelBtn) { footer = [primary, cancelBtn, footer]; }

    const classes = ['dialog default-dialog'];

    if (typeof isChanged === 'function' ? isChanged() : undefined) { classes.push('is-changed'); }
    if (className) { classes.push(className); }
    className = classes.join(' ');

    return (
      <Panel className={className} header={header} footer={footer}>
        {this.props.children}
      </Panel>
    );
  }
}
