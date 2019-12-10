import {
  React, action, PropTypes, observable, observer, styled,
} from 'vendor';
import { Modal, Button } from 'react-bootstrap';
import Loading from 'shared/components/loading-animation';
import { AsyncButton } from 'shared';
import { GradingTemplates } from '../../../models/grading/templates';
import TemplateCard from './card';
import * as EDIT_TYPES from './editors';

const CardsBody = styled.div`
  display: flex;
`;


@observer
class GradingTemplateModal extends React.Component {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
  }

  store = new GradingTemplates()
  @observable editing = null;

  @action.bound onModalClose() {
    this.modalIsOpen = false;
  }

  @action.bound onEditTemplate(template) {
    this.editing = template;
  }

  constructor(props) {
    super(props);
    this.store.fetch();
  }

  modalBody() {
    if (this.store.api.isPending) {
      return <Loading message="Fetching templates…" />;
    }

    if (this.editing) {
      const Edit = EDIT_TYPES[this.editing.type];
      if (Edit) {
        return <Edit template={this.editing} />;
      }
    }

    return (
      <CardsBody>
        {this.store.array.map(tmpl =>
          <TemplateCard
            key={tmpl.id}
            onEdit={this.onEditTemplate}
            template={tmpl}
            store={this.store} />)}
      </CardsBody>
    );

  }

  @action.bound onSave() {
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
          <Button onClick={onClose} variant="default">
            Cancel
          </Button>
          {this.editing && (<AsyncButton
            onClick={this.onSave}
            waitingText="Saving…"
            isWaiting={this.editing && this.editing.api.isPending}
          >
             Save
          </AsyncButton>)}
        </Modal.Footer>
      </Modal>
    );
  }

}

export default GradingTemplateModal;
