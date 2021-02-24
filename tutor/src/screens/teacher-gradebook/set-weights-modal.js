import { React, PropTypes, observer, styled } from 'vendor';
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
        & form {
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

        & .percentage-error {
          color: ${colors.danger};
        }
    }
}
`;

const enforceNumberInput = (ev) => {
    if (ev.key.length === 1 && /\D/.test(ev.key)) {
        ev.preventDefault();
    }
};

const onChangeInput = (uxWeights, ev) => {
    uxWeights.setWeight(ev.target.value, ev.target.name);
};

const setDefaults = (uxWeights, form) => {
    const defaults = uxWeights.getDefaults();
    uxWeights.ux_reading_weight = defaults.ux_reading_weight;
    uxWeights.ux_homework_weight = defaults.ux_homework_weight;
    form.setFieldValue('ux_reading_weight', defaults.ux_reading_weight);
    form.setFieldValue('ux_homework_weight', defaults.ux_homework_weight);
};


const SetWeightsModal = observer(({ ux }) => {
    const { weights: uxWeights } = ux;
  
    return (
        <StyledModal
            show={uxWeights.showWeightsModal}
            onHide={() => uxWeights.hideWeights()}
        >
            <Modal.Header closeButton>
          Set weights
            </Modal.Header>
            <Modal.Body>
                <p>Default Course average =</p>
                <p>50% of Homework average + 50% of Reading average</p>
                <Formik
                    initialValues={{ ux_homework_weight: uxWeights.ux_homework_weight, ux_reading_weight: uxWeights.ux_reading_weight }}
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
                                                    name="ux_homework_weight"
                                                    min={0} max={100}
                                                    onChange={(ev) => onChangeInput(uxWeights, ev)}
                                                    onKeyDown={enforceNumberInput}
                                                />
                                                <label>%</label>
                                            </div>
                                        </div>
                                        <div className="flex-box reading-input">
                                            <label>Reading Average</label>
                                            <div>
                                                <NumberInput
                                                    name="ux_reading_weight"
                                                    min={0} max={100}
                                                    onChange={(ev) => onChangeInput(uxWeights, ev)}
                                                    onKeyDown={enforceNumberInput}
                                                />
                                                <label>%</label>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="flex-box total-weight">
                                            <label>Total course average:</label><label className={uxWeights.total !== 100 ? 'percentage-error' : ''}>{uxWeights.total}%</label> 
                                        </div>   
                                    </div>
                                    <div className="flex-box form-button">  
                                        <Button
                                            onClick={() => setDefaults(uxWeights, form)}
                                            variant='link'
                                        >Set default
                                        </Button>
                                        <div>
                                            <Button
                                                variant="default"
                                                disabled={uxWeights.isBusy}
                                                onClick={() => uxWeights.hideWeights()}
                                                size="lg"
                                            >
                        Cancel
                                            </Button>
                                            <AsyncButton
                                                isWaiting={uxWeights.isBusy}
                                                waitingText="Recalculating scores…"
                                                onClick={uxWeights.onSaveWeights}
                                                disabled={!uxWeights.isSaveable}
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
  
});

SetWeightsModal.propTypes = {
    ux: PropTypes.object,
};

export default SetWeightsModal;
