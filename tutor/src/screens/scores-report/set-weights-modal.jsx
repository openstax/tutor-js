import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import cn from 'classnames';
import { action, computed } from 'mobx';
import { Modal, Button, Alert } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import ExternalLink from '../../components/new-tab-link';
import Icon from '../../components/icon';

@observer
export default class SetWeightsModal extends React.Component {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  renderErrors() {
    const { errorMessage } = this.props.ux.weights;
    if (!errorMessage) { return null; }
    return (
      <Alert bsStyle="danger">
        {errorMessage}
      </Alert>
    );
  }

  render() {
    const { ux: { weights } } = this.props;
    if (!weights.isSetting) { return null; }

    return (
      <Modal
        show={true}
        backdrop="static"
        className="set-weights"
      >
        <Modal.Header>
          Set course average weights
        </Modal.Header>
        <Modal.Body
          className={
            cn({'page-loading loadable is-loading': true})
          }
        >
          <div>
            We recommend using homework scores and reading progress.
          </div>
          <ExternalLink
            to="https://openstax.org/blog/new-openstax-tutor-scoring-feature"
            className="set-weights--external-link"
          >
            See why <Icon type="external-link"/>
          </ExternalLink>
          <label className="weight">
            <div>Homework scores</div>
            <div>
              <input
                type="number"
                name="homework_scores"
                min={0}
                max={100}
                value={weights.homework_scores}
                onChange={weights.setWeight}
              />%
            </div>
          </label>
          <label className="weight">
            <div>Homework progress</div>
            <div>
              <input
                type="number"
                name="homework_progress"
                min={0}
                max={100}
                value={weights.homework_progress}
                onChange={weights.setWeight}
              />%
            </div>
          </label>
          <label className="weight">
            <div>Reading scores</div>
            <div>
              <input
                type="number"
                name="reading_scores"
                min={0}
                max={100}
                value={weights.reading_scores}
                onChange={weights.setWeight}
              />%
            </div>
          </label>
          <label className="weight">
            <div>Reading progress</div>
            <div>
              <input
                type="number"
                name="reading_progress"
                min={0}
                max={100}
                value={weights.reading_progress}
                onChange={weights.setWeight}
              />%
            </div>
          </label>
          <p className={cn('weights-msg', {
              invalid: weights.showIsInvalid,
              valid: weights.showIsValid,
          })}>
            <Icon type={weights.msgIconType}/>{weights.msg}
          </p>
          {this.renderErrors()}
        </Modal.Body>
        <Modal.Footer>
          <AsyncButton
            isWaiting={weights.isBusy}
            onClick={weights.onSaveWeights}
            disabled={!weights.isSaveable}
            bsStyle={(weights.isSaveable && 'primary') || 'default'}
          >Save</AsyncButton>
          <Button
            onClick={weights.setDefaults}
            disabled={!weights.isRestorable}
            className={weights.isRestorable && 'btn-secondary'}
          >Restore default</Button>
          <Button
            onClick={weights.onCancelClick}
            className={'btn-outline-secondary'}
          >Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
