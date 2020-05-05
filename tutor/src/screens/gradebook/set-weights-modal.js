import { React, PropTypes, useObserver, styled } from 'vendor';
import { Formik } from 'formik';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import { colors } from 'theme';
import NumberInput from '../../components/number-input';

const StyledModal = styled(Modal)`
.modal-dialog {
        max-width: 600px
    }
    .modal-dialog .modal-header, .modal .modal-header {
        background-color: ${colors.neutral.lighter};
        font-size: 1.6rem;
        font-weight: bold;
        & span {
            font-size: 3rem;
        }
    }
    .modal-body {
        font-size: 1.5rem;
        line-height: 20px;
        color: ${colors.neutral.darker};
        form {
            margin-top: 20px;
            & .form-input {
                width: 50%;
                & p {
                    font-weight: bold;
                }
                & .rc-input-number-input-wrap {
                    width: 40px;
                }
                & .reading-input {
                    margin-top: 10px;
                }
                & .homework-input, .reading-input {
                    & label:last-child {
                        padding-left: 10px;
                    }
                }
                & .total-weight label:last-child {
                    margin-right: 30px;
                }
            }
            & .form-button {
                margin-top: 30px;
                & .btn-link {
                    padding: 0;
                }
            }
        }
        & .flex-box {
                display: flex;
                justify-content: space-between;
            }
    }
}
`;

const SetWeightsModal = ({ ux }) => {
  
  const { weights } = ux;

  return useObserver(() =>
    <StyledModal
      show={weights.showWeightsModal}
      onHide={() => weights.hideWeights()}
    >
      <Modal.Header closeButton>
          Set weights
      </Modal.Header>
      <Modal.Body>
        <p>Default Course average =</p>
        <p>50% of Homework average + 50% of Reading average</p>
        <Formik
          initialValues={{ homework: 50, reading: 50 }}
          onSubmit={(values, actions) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              actions.setSubmitting(false);
            }, 1000);
          }}
        >
          {
            form => {
              return (
                <form>
                  <div className="form-input">
                    <p>Set Weights</p>
                    <div className="flex-box homework-input">
                      <label>Homework Average</label>
                      <div>
                        <NumberInput
                          name="homework"
                          min={0} max={100}
                          onChange={(ev) => form.setFieldValue('homework', ev.target.value)}
                        />
                        <label>%</label>
                      </div>
                    </div>
                    <div className="flex-box reading-input">
                      <label>Reading Average</label>
                      <div>
                        <NumberInput
                          name="reading"
                          min={0} max={100}
                          onChange={(ev) => form.setFieldValue('reading', ev.target.value)}
                        />
                        <label>%</label>
                      </div>
                    </div>
                    <hr />
                    <div className="flex-box total-weight">
                      <label>Total course average:</label><label>100%</label> 
                    </div>   
                  </div>
                  <div className="flex-box form-button">  
                    <Button
                      onClick={weights.setDefaults}
                      variant='link'
                    >Set default
                    </Button>
                    <div>
                      <Button
                        variant="default"
                        disabled={weights.isBusy}
                        onClick={() => weights.hideWeights()}
                        size="lg"
                      >
                        Cancel
                      </Button>
                      <AsyncButton
                        isWaiting={weights.isBusy}
                        waitingText={weights.savingButtonText}
                        onClick={weights.onSaveWeights}
                        disabled={!weights.isSaveable}
                        variant="primary"
                        size="lg"
                      >
                        Save
                      </AsyncButton>
                    </div>
                  </div>
                </form>
              );
            }
          }
        </Formik>
      </Modal.Body>
    </StyledModal>
  );
  
};

SetWeightsModal.propTypes = {
  ux: PropTypes.object,
};

export default SetWeightsModal;
