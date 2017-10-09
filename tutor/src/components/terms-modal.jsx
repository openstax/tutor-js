import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, computed } from 'mobx';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import Branding from './branding/course';
import User from '../models/user';
import { map } from 'lodash';
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
    if (!User.terms_signatures_needed) { return null; }

    return (
      <Modal
        animation={false}
        show={true}
        backdrop="static"
        className={classnames('user-terms', { 'is-loading': User.terms.api.isPending })}
      >
        <Modal.Header>
          <Branding isBeta={true} /> {this.title}
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
      </Modal>
    );
  }
}
