import { React, PropTypes, styled, observer, action } from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import UX from '../ux';
import CloneModal from 'components/course-modal';
import { colors, breakpoints } from 'theme';

const StyledTemplateModal = styled(CloneModal)`
  && {
    .modal-dialog {
      margin-top: 3rem;
      max-width: 100rem;
    }
    .modal-body {
      background: ${colors.white};
      padding: 0 1rem;
    }
  }

  &&& {
    .modal-footer {
      border-top: 2px solid ${colors.neutral.pale};
      background-color: ${colors.neutral.bright};
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;

      /* Cancel buttons */
      & div:first-child {
        .btn {
          background: white;
        }
      }
      /* Save as Draft, Publish, and Edit other details buttons */
      & div:last-child {
        .btn:not(:last-child) {
          background: ${colors.neutral.lite};
          border: 1px solid ${colors.neutral.lite};
        }
      }
    }
  }

  @media ${breakpoints.xlUp} {
  .modal-dialog {
    max-width: 65%;
  }
}
`;

const WrqNote = styled.div`
  padding: 0 1rem;
  ul {
    padding: 0 1.5rem;
    color: ${colors.neutral.dark};
  }
`;

@observer
class Editor extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    showModal: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  }

  @action.bound
  async saveDraft() {
    const { ux: { saveAsDraft }, onHide } = this.props;
    await saveAsDraft();
    onHide();
  }

  @action.bound
  async publish() {
    const { ux: { savePlan }, onHide } = this.props;
    await savePlan();
    onHide();
  }

  @action.bound
  async editDetails() {
    const { ux: { saveAsDraft, navigateToStep } } = this.props;
    await saveAsDraft();
    navigateToStep('details');
  }

  render() {
    const { ux, showModal, onHide } = this.props;
    return (
      <StyledTemplateModal
        show={showModal}
        backdrop="static"
        onHide={onHide}
        templateType={ux.plan.type}
      >
        <Modal.Header closeButton>
          {`Add details to ${ux.plan.title}`}
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={ux.formValues} 
            validateOnMount={true}
          >
            {ux.renderMiniCloneEditor}
          </Formik>
          {/* How information about WRM and grading template. */}
          {
            !ux.isCloneOldAssignment && 
            <WrqNote>
              <strong><label>Note</label></strong>
              <ul>
                <li>OpenStax Tutor Beta allows you to assign points to questions.</li>
                <li>You can assign Written Response Questions (manually-graded) to students.</li>
                <li>By default, MCQs are worth 1 point, and WRQs are worth 2 points.</li>
                <li>To assign WRQs or to set points, click on Edit other details.</li>
              </ul>
            </WrqNote>
          }
        </Modal.Body>
        <Modal.Footer>
          <div>
            <Button
              variant="default"
              onClick={onHide}
              size="lg"
            >
            Cancel
            </Button>
          </div>
          <div>
            <Button
              className="other-button"
              size="lg"
              onClick={this.saveDraft}
            >
            Save as Draft
            </Button>
            <Button
              className="other-button"
              size="lg"
              onClick={this.publish}
            >
            Publish
            </Button>
            <Button
              size="lg"
              onClick={this.editDetails}
            >
            Edit other details
            </Button>
          </div>
          
        </Modal.Footer>
      </StyledTemplateModal>
     
     
    );
  }
}
export default Editor;
