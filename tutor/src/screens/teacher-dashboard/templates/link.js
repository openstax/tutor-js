import { React, styled, action, observer, observable } from 'vendor';
import { Button } from 'react-bootstrap';
import Modal from './modal';

const Link = styled(Button).attrs({
  variant: 'link',
})`


`;

@observer
class GradingTemplateLink extends React.Component {

  @observable modalIsOpen = false;

  @action.bound onModalClose() {
    this.modalIsOpen = false;
  }

  @action.bound onOpenModal() {
    this.modalIsOpen = true;
  }

  render() {
    return (
      <>
        <Link onClick={this.onOpenModal}>Grading Templates</Link>
        {this.modalIsOpen && <Modal onClose={this.onModalClose} />}
      </>
    );
  }
}

export default GradingTemplateLink;
