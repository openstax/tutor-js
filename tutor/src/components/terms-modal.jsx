import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action, computed } from 'mobx';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import Branding from './branding/course';
import User from '../models/user';
import Course from '../models/course';
import { isEmpty, map } from 'lodash';
import String from '../helpers/string';

export default
@observer
class TermsModal extends React.Component {

  static propTypes = {
    canBeDisplayed: PropTypes.bool,
  }

  @computed get title() {
    return String.toSentence(map(User.unsignedTerms, 'title'));
  }

  @action.bound onAgreement() {
    User.terms.sign();
  }

  render() {
    // for terms to be displayed the user must need them signed and be in a course
    if (
      !User.terms_signatures_needed || !this.props.canBeDisplayed || isEmpty(User.unsignedTerms)
    ) { return null; }

    const className = classnames('user-terms', { 'is-loading': User.terms.api.isPending });

    return (
      <Modal
        show={true}
        backdrop="static"
        backdropClassName={className}
        className={className}
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
          <Button variant="primary" onClick={this.onAgreement}>I agree</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
