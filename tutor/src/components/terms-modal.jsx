import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, computed } from 'mobx';

import User from '../models/user';
import { Modal, Button } from 'react-bootstrap';
import { map, isEmpty } from 'lodash';
import String from '../helpers/string';

@observer
export default class TermsModal extends React.PureComponent {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  @computed get title() {
    return String.toSentence(map(User.unsignedTerms, 'title'));
  }

  @action.bound onAgreement() {
    User.terms.sign();
  }

  render() {
    if (isEmpty(User.unsignedTerms)) { return null; }


    return (
      <Modal.Dialog className="user-terms" bsSize="lg">
        <Modal.Header>
          Please agree to {this.title} before continuing.
        </Modal.Header>
        <Modal.Body>
          {map(User.unsignedTerms, (t) =>
            <div key={t.id}>
              <h1 className="title">{t.title}</h1>
              <div dangerouslySetInnerHTML={{ __html: t.content }} />
            </div>)}
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" onClick={this.onAgreement}>I agree</Button>
        </Modal.Footer>
      </Modal.Dialog>
    );
  }
}
