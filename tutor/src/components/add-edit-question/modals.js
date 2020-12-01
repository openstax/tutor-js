import { React, PropTypes, styled, observer } from 'vendor';
import { Button, Modal } from 'react-bootstrap';
import { colors } from 'theme';
import AddEditQuestionUX from './ux';

const StyledHeader = styled(Modal.Header)`
  font-weight: bold;
  font-size: 1.8rem;
  padding: 2.5rem 3rem;
`;

const StyledBody = styled(Modal.Body)`
  font-size: 1.6rem;
  line-height: 2.5rem;
  .note {
      font-size: 1.4rem;
      color: ${colors.neutral.thin};
  }
`;

const ControlsWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Controls = styled.div`
  .btn.btn-default {
    background-color: white;
    color: ${colors.neutral.grayblue};
  }
  .btn + .btn {
    margin-left: 1.5rem;
  }
`;


const FeedbackTipModal = observer(({ ux }) => {
  return (
    <Modal
      show={ux.feedbackTipModal.show}
      backdrop="static"
    >
      <StyledHeader>
        Tip: Add feedback!
      </StyledHeader>
      <StyledBody>
        <p>Add explanatory feedback for the answer choices. Students learn better when they recieve immediate and specific feedback.</p>
        <p className="note">Note: Ideally, this feedback should anticipate common misconceptions or calculation errors.</p>
        <ControlsWrapper>
          <Controls>
            <Button variant="default" size="lg" onClick={() => ux.doPublish(ux.feedbackTipModal.shouldExitOnPublish)}>
              Publish anyway
            </Button>
            <Button variant="primary" size="lg" onClick={() => ux.feedbackTipModal.show = false}>
              Add feedback
            </Button>
          </Controls>
        </ControlsWrapper>
      </StyledBody>
    </Modal>
  );
});
FeedbackTipModal.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export { FeedbackTipModal };
