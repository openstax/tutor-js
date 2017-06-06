import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, computed } from 'mobx';

import User from '../models/user';
import { Modal, Button } from 'react-bootstrap';
import { first } from 'lodash';

@observer
export default class TermsModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  @computed get term() {
    return first(User.unsignedTerms);
  }

  @action.bound onAgreement() {
    this.term.sign();
  }

  render() {
    const { term } = this;
    if (!term) { return null; }

    return (
      <Modal.Dialog className="user-terms">
        <Modal.Header><h4>{term.title}</h4></Modal.Header>
        <Modal.Body>
          <div dangerouslySetInnerHTML={{__html: term.content}} />
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onAgreement}>I agree</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
