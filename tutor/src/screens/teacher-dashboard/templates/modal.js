import { React, action, PropTypes, observer } from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import Loading from 'shared/components/loading-animation';
import { GradingTemplate, GradingTemplates } from '../../../models/grading/templates';
// import { AsyncButton } from 'shared';

const TemplateCard = ({ template }) => {
  return (
    <a>{template.name}</a>
  );
};
TemplateCard.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
  store: PropTypes.instanceOf(GradingTemplates).isRequired,
};


@observer
class GradingTemplateModal extends React.Component {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  store = new GradingTemplates()

  @action.bound onModalClose() {
    this.modalIsOpen = false;
  }

  constructor(props) {
    super(props);
    this.store.fetch();
  }

  modalBody() {
    if (this.store.api.isPending) {
      return <Loading message="Fetching templates…" />;
    }
    return this.store.array.map(tmpl =>
      <TemplateCard template={tmpl} store={this.store} />
    );
  }

  @action.bound performSave() {
    // await model.save() then:
    this.props.onClose();
  }

  render() {
    const { onClose } = this.props;

    return (
      <Modal
        show={true}
        onHide={onClose}
      >
        <Modal.Header closeButton={true}>
          <Modal.Title>
            Grading Templates
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.modalBody()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={onClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

}

export default GradingTemplateModal;
