import { React, observer, styled, useEffect, useMemo, PropTypes } from 'vendor';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddEditQuestionTermsOfUseModal from '../course-modal';
import CheckboxInput from '../checkbox-input';
import { colors } from 'theme';
import { currentUser } from '../../models';

const TERMS_NAME = 'exercise_editing';

const StyledAddEditQuestionTermsOfUseModal = styled(AddEditQuestionTermsOfUseModal)`
    &&& {
        .modal-header {
            background-color: ${colors.neutral.lighter};
        }
    }
    .i-agree {
        display: flex;
    }
    .modal-dialog {
        margin: 4rem auto;
        max-width: 1200px;
    }
    .modal-body {
      > span {
        color: ${colors.neutral.darker};
        font-weight: 400;
        margin-top: 3rem; 
      }
      .buttons-wrapper {
        margin-top: 2rem;
        float: right;
        .btn + .btn {
            margin-left: 1.6rem;
        }
        .btn {
            font-weight: 700;
            padding: 0.75rem 4rem;
            :not(.btn-primary) {
                color: ${colors.neutral.grayblue};
                background-color: ${colors.white};
           }   
        }
      }
      // terms content
      h4 {
        font-size: 3rem;
        text-align: center;
        margin-bottom: 2rem;
        font-weight: 700;
      }
      h5 {
        font-size: 1.8rem;
        font-weight: 700;
        center {
          font-size: 2.4rem;
        }
      }
    }
`;

const agreeTermsOfUse = () => {
    const term = currentUser.terms.get(TERMS_NAME);
    if (term) {
        currentUser.terms.sign([term.id]);
    }
};

const TermAgreement = ({ onClose }) => {
    const [agree, setAgree] = useState(false);
    return (
        <>
            <CheckboxInput
                className="i-agree"
                onChange={() => setAgree(prevState => !prevState)}
                label="I have read and agree to these terms of use."
                checked={agree}
                standalone
            />
            <div className="buttons-wrapper">
                <Button
                    variant="default"
                    className="cancel"
                    onClick={onClose}>
          Cancel
                </Button>
                <Button
                    data-test-id="agree-to-terms"
                    variant="primary"
                    disabled={!agree}
                    onClick={agreeTermsOfUse}>
          Accept and continue
                </Button>
            </div>
        </>
    );
};
TermAgreement.propTypes = {
    onClose: PropTypes.func.isRequired,
};

const AddEditQuestionTermsOfUse = observer(({ show, onClose, displayOnly = false }) => {
    const [termContent, setTermContent] = useState(null);

    const term = useMemo(() => currentUser.terms.get(TERMS_NAME),
        [currentUser.terms.get(TERMS_NAME).content]);

    useEffect(() => {
        if (show) {
            currentUser.terms.fetch();
        }
    }, [show]);
    useEffect(() => {
        setTermContent(term ? term.content : '');
    }, [term.content]);

    return (
        <StyledAddEditQuestionTermsOfUseModal
            show={show}
            backdrop="static"
            onHide={onClose}
            data-test-id="terms-modal"
            templateType="addEditQuestion"
        >
            <Modal.Header closeButton>
        Terms of use
            </Modal.Header>
            <Modal.Body>
                <div data-is-loaded={!!termContent} dangerouslySetInnerHTML={{ __html: termContent }} />
                {!displayOnly && <TermAgreement onClose={onClose} />}
            </Modal.Body>
        </StyledAddEditQuestionTermsOfUseModal>
    );
});
AddEditQuestionTermsOfUse.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    displayOnly: PropTypes.bool,
};

export default AddEditQuestionTermsOfUse;
