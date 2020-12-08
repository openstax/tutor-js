import { React, observer, styled, useEffect } from 'vendor';
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import AddEditQuestionTermsOfUseModal from '../course-modal';
import CheckboxInput from '../checkbox-input';
import { colors } from 'theme';
import User from '../../models/user';

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

const AddEditQuestionTermsOfUse = observer(({ ux }) => {
  const [agree, setAgree] = useState(false);
  useEffect(() => {
    User.terms.fetch();
  }, []);
  return (
    <StyledAddEditQuestionTermsOfUseModal
      show={true}
      backdrop="static"
      onHide={() => ux.onDisplayModal(false)}
      templateType="addEditQuestion">
      <Modal.Header closeButton>
        Terms of use
      </Modal.Header>
      <Modal.Body>

        <div dangerouslySetInnerHTML={{ __html: ux.termsOfUse }} />

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
            onClick={() => ux.onDisplayModal(false)}>
                Cancel
          </Button>
          <Button
            variant="primary"
            disabled={!agree}
            onClick={ux.agreeTermsOfUse}>
              Done
          </Button>
        </div>
      </Modal.Body>
    </StyledAddEditQuestionTermsOfUseModal>
  );
});

export default AddEditQuestionTermsOfUse;
