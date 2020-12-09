import { React, observer, styled, useEffect, useMemo } from 'vendor';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddEditQuestionTermsOfUseModal from '../course-modal';
import CheckboxInput from '../checkbox-input';
import { colors } from 'theme';
import User from '../../models/user';

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
        max-width: 55%;
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
    }
`;

const agreeTermsOfUse = () => {
  const term = User.terms.get(TERMS_NAME);
  if (term) {
    User.terms.sign([term.id]);
  }
};

const AddEditQuestionTermsOfUse = observer(({ show, onClose, displayOnly = false }) => {
  const [agree, setAgree] = useState(false);
  const [termContent, setTermContent] = useState(null);

  const term = useMemo(() => User.terms.get(TERMS_NAME),
    [User.terms.get(TERMS_NAME).content]);
  
  useEffect(() => {
    User.terms.fetch();
  }, []);
  useEffect(() => {
    setTermContent(term ? term.content : '');
  }, [term.content]);
  
  return (
    <StyledAddEditQuestionTermsOfUseModal
      show={show}
      backdrop="static"
      onHide={onClose}
      templateType="addEditQuestion">
      <Modal.Header closeButton>
        Terms of use
      </Modal.Header>
      <Modal.Body>
        <div dangerouslySetInnerHTML={{ __html: termContent }} />
        {!displayOnly && 
        <>
          <CheckboxInput
            className="i-agree"
            onChange={() => setAgree(prevState => !prevState)}
            label="I certify that these questions do not violate any copyright, trademark, or other intellectual property laws."
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
              variant="primary"
              disabled={!agree}
              onClick={agreeTermsOfUse}>
              Accept and continue
            </Button>
          </div>
        </>
        }
      </Modal.Body>
    </StyledAddEditQuestionTermsOfUseModal>
  );
});

export default AddEditQuestionTermsOfUse;
