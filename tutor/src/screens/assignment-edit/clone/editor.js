import { React, PropTypes, styled, observer } from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import UX from '../ux';
import CloneModal from 'components/course-modal';
import { colors, breakpoints } from 'theme';

const StyledTemplateModal = styled(CloneModal)`
  .modal-dialog {
    margin-top: 3rem;
    max-width: 90%;
  }

  .modal-body {
    background: ${colors.white};
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

@observer
class Editor extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    showModal: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
  }

  onSave() {
    const saving = this.save();
    return this.setState({ saving, publishing: false });
  }

  onPublish() {
    const publishing = this.publish();
    return this.setState({ saving: false, publishing });
  }

  onCancel() {
    this.props.onHide();
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
            >
            Save as Draft
            </Button>
            <Button
              className="other-button"
              size="lg"
            >
            Publish
            </Button>
            <Button
              size="lg"
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
