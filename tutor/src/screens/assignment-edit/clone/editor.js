import { React, PropTypes, styled, observer, cn } from 'vendor';
import UX from '../ux';
import { Container, Col, Alert, Button, Modal } from 'react-bootstrap';
import { camelCase } from 'lodash';
import TutorLink from '../../../components/link';
import Tasking from '../tasking';
import { TutorInput } from '../../../components/tutor-input';
//import PublishButton from '../footer/save-button';
//import DraftButton from '../footer/save-as-draft';
//import NudgeIsAvailableMessage from '../nudge-is-available-message';
//import Theme from '../../../theme';
import { Formik } from 'formik';
import CloneModal from 'components/course-modal';
import { colors, fonts } from 'theme';

// const StyledNudgeIsAvailableMessage = styled(NudgeIsAvailableMessage)`
//   font-size: 14px;
//   line-height: 20px;
//   padding-left: 1.5rem;
// `;

const StyledTemplateModal = styled(CloneModal)`
  .modal-dialog {
    margin-top: 3rem;
    max-width: 680px;

    .modal-body {
      background: ${colors.neutral.bright};

      .btn-default {
        border-color: ${colors.neutral.pale};
        background: #FFFFFF;
      }
    }
  }
`;

const StyledEditor = styled.div`
  h4 {
    margin: 1rem 0 2rem 0;
  }
  .ox-icon-calendar  {
    display: none;
  }
  .tasking-time-default {
    display: none;
  }
  .col-6 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .tasking {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`;

const Footer = styled.div`
  display: flex;
  padding: 1.5rem;
  background-color: ${colors.neutral.bright};
  margin-top: 1rem;
  bottom: 0;
  width: 100%;
  position: absolute;
  > * {
    margin-right: 1rem;
  }
`;

@observer
class TaskPlanMiniEditor extends React.Component {

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
    let errorAttrs;
    const { ux, showModal, onHide } = this.props; // id, course, termStart, termEnd } = this.props;

    return (
    // <StyledEditor
    //   className={cn(`${plan.type}-plan`, 'task-plan', {
    //     'is-invalid-form': form.showErrors,
    //   })}
    // >
    //   {/* <StyledNudgeIsAvailableMessage planType={plan.type} /> */}
    //   <Container>
    //     <div className="row">
    //       <Col xs={12}>
    //         <h4>
    //           Add Copied Assignment
    //         </h4>
    //       </Col>
    //     </div>
    //     <div className="row">
    //       <Col xs={12}>
    //         <TutorInput
    //           {...form.title}
    //           label="Title"
    //           className="assignment-name"
    //           id="reading-title"
    //         />
    //       </Col>
    //     </div>

    //     <Tasking ux={ux} />

      //     <div className="row">
      //       <Col xs={6}>
      //         Assigned to all sections
      //       </Col>
      //       <Col xs={6} className="text-right">
      //         <TutorLink to={camelCase('editAssignment')} params={{ type: 'clone', id: sourcePlanId, courseId: course.id }}>
      //           Edit other assignment details
      //         </TutorLink>
      //       </Col>
      //     </div>
      //     {errorAttrs && (
      //       <Alert variant="danger">
      //         <h3>
      //           {errorAttrs.title}
      //         </h3>
      //         {errorAttrs.body}
      //       </Alert>)}
      //   </Container>
      //   <Footer>
      //     <PublishButton ux={ux} />
      //     <DraftButton ux={ux} />
      //     <Button
      //       size="small"
      //       className="cancel"
      //       variant="secondary"
      //       onClick={ux.onCancel}
      //     >
      //       Cancel
      //     </Button>
      //   </Footer>
      // </StyledEditor>
      <StyledTemplateModal
        show={showModal}
        backdrop="static"
        onHide={onHide}
        templateType={ux.plan.type}
      >
        <Modal.Header>
          {'Add details to assignment name'}
        </Modal.Header>
        <Modal.Body>
          <Formik
            initialValues={ux.formValues} 
            validateOnMount={true}
          >
            {ux.renderMiniCloneEditor}
          </Formik>
        </Modal.Body>
      </StyledTemplateModal>
     
     
    );
  }
}

export default TaskPlanMiniEditor;
