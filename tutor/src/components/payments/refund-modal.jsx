import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import OXFancyLoader from 'shared/components/staxly-animation';
import { AsyncButton } from 'shared';
import Purchase from '../../models/purchases/purchase';

@observer
class ProcessRefund extends React.Component {
  static propTypes = {
      purchase:   PropTypes.instanceOf(Purchase).isRequired,
      onCancel:   PropTypes.func.isRequired,
      onContinue: PropTypes.func.isRequired,
  }

  @action.bound
  onRequestRefund() {
      this.props.purchase.refund().then(this.props.onContinue);
  }

  render() {
      const { purchase, onCancel } = this.props;
      return (
          <Modal
              show={true}
              className="refund process"
          >
              <OXFancyLoader isLoading={purchase.api.isPending} />
              <Modal.Header>
                  <Modal.Title>We will refund the following amount to the original form of payment</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <h1 className="amount">${purchase.formattedTotal}</h1>
                  <p>
            You will see a record of this transaction on your payments page.
                  </p>
              </Modal.Body>
              <Modal.Footer>
                  <AsyncButton
                      variant="primary"
                      data-identifier={purchase.identifier}
                      isWaiting={purchase.api.isPending}
                      onClick={this.onRequestRefund}
                  >
            Process refund
                  </AsyncButton>
                  <Button onClick={onCancel} variant="default">Cancel</Button>
              </Modal.Footer>
          </Modal>
      );
  }
}


@observer
class Survey extends React.Component {

  static propTypes = {
      purchase:   PropTypes.instanceOf(Purchase).isRequired,
      onContinue: PropTypes.func.isRequired,
  }

  @action.bound
  onSubmit() {
      this.props.purchase.refund_survey = {
          why: this.form.elements.namedItem('why').value,
          other_reason: this.form.elements.namedItem('other-reason').value,
          comments: this.form.elements.namedItem('comments').value,
      };
      this.props.onContinue();
  }

  render() {
      const { onContinue } = this.props;
      return (
          <Modal
              show={true}
              className="refund survey"
          >
              <Modal.Header>
                  <Modal.Title>Help us improve</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                  <p>
            Before you go, please give us some feedback to help us improve OpenStax Tutor Beta.
                  </p>
                  <p>
            Why did you decide to stop using OpenStax Tutor Beta?
                  </p>
                  <form ref={(f) => (this.form = f)}>
                      <label>
                          <input type="radio" name="why" value="dropped" /> I dropped my course
                      </label>
                      <label>
                          <input type="radio" name="why" value="too-expensive" /> It’s too expensive
                      </label>
                      <label>
                          <input type="radio" name="why" value="not-required" /> I’m not required to use OpenStax Tutor Beta for my course
                      </label>
                      <label>
                          <input type="radio" name="why" value="not-beneficial" /> It doesn’t seem beneficial
                      </label>
                      <label>
                          <input type="radio" name="why" value="other" /> Other
                      </label>
                      <textarea name="other-reason"></textarea>
                      <p>
              Anything else you'd like to share?
                      </p>
                      <textarea name="comments"></textarea>
                  </form>
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={this.onSubmit} variant="primary">Submit</Button>
                  <Button onClick={onContinue}>Skip this</Button>
              </Modal.Footer>
          </Modal>
      );
  }
}


function AreYouSure({ purchase, onCancel, onContinue }) {
    return (
        <Modal
            show={true}
            className="refund confirm"
        >
            <Modal.Header>
                <Modal.Title>You are requesting a refund for {purchase.product.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
        This will remove you from the class and you will no longer have access to
        your work. Are you sure you want to continue?
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={onContinue} variant="primary">Continue</Button>
                <Button onClick={onCancel} variant="default">Cancel</Button>
            </Modal.Footer>
        </Modal>
    );
}
AreYouSure.propTypes = {
    purchase:   PropTypes.instanceOf(Purchase).isRequired,
    onContinue: PropTypes.func.isRequired,
    onCancel:   PropTypes.func.isRequired,
};


@observer
class RefundStages extends React.Component {

  @observable stage = 0;

  @action.bound
  onContinue() {
      this.stage += 1;
  }

  render() {
      const props = { onContinue: this.onContinue, ...this.props };
      if (this.stage == 0) return <AreYouSure {...props} />;
      if (this.stage == 1) return <Survey {...props} />;
      if (this.stage == 2) return <ProcessRefund {...props} />;
      return null;
  }
}


export default function RefundModal(props) {
    // for testing without running payments server
    // props = { ...props, purchase: new Purchase({
    //   identifier: 'test',
    //   total: 12.82,
    //   product: { name: 'Foo' },
    // }) };
    return props.purchase ? <RefundStages {...props} /> : null;
}

RefundModal.propTypes = {
    purchase: PropTypes.instanceOf(Purchase),
};
