import PropTypes from 'prop-types';
import React from 'react';
import { action, computed, modelize } from 'shared/model'
import { observer, inject } from 'mobx-react';
import { Modal, Button } from 'react-bootstrap';
import classnames from 'classnames';
import Branding from './branding/course';
import { currentUser } from '../models';
import { map } from 'lodash';
import String from '../helpers/string';
import ModalManager from './modal-manager';

@inject('modalManager')
@observer
export default
class TermsModal extends React.Component {
    static propTypes = {
        modalManager: PropTypes.instanceOf(ModalManager).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get terms() {
        return currentUser.terms.requiredAndUnsigned;
    }

    @computed get title() {
        return String.toSentence(map(this.terms, 'title'));
    }

    @action.bound onAgreement() {
        currentUser.terms.sign(map(this.terms, 'id'));
    }

    componentDidMount() {
        this.props.modalManager.queue(this, 1);
        currentUser.terms.fetchIfNeeded();
    }

    // for terms to be displayed the user must be in a course and need them signed
    @computed get isReady() {
        return currentUser.terms.areSignaturesNeeded;
    }

    render() {
        if (!this.props.modalManager.canDisplay(this) || !this.isReady) { return null; }

        const className = classnames('user-terms', { 'is-loading': currentUser.terms.api.isPending });

        return (
            <Modal
                show={true}
                backdrop="static"
                backdropClassName={className}
                className={className}
            >
                <Modal.Header>
                    <Branding isBeta={true} /> <span className="header-title">{this.title}</span>
                </Modal.Header>
                <Modal.Body>
                    {map(this.terms, (t) =>
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
}
