import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import cn from 'classnames';
import { action, computed } from 'mobx';
import { Modal, Button } from 'react-bootstrap';
import ExternalLink from '../../components/new-tab-link';
import Icon from '../../components/icon';

@observer
export default class SetWeightsModal extends React.Component {

  static propTypes = {
    ux: MobxPropTypes.observableObject,
  }

  render() {
    const { ux: { weights } } = this.props;
    if (!weights.isSetting) { return null; }

    return (
      <Modal
        animation={false}
        show={true}
        backdrop="static"
        className="set-weights"
      >
        <Modal.Header>
          Set course average weights
        </Modal.Header>
        <Modal.Body>
          <div>
            We recommend using homework scores and reading progress.
          </div>
          <ExternalLink
            to="http://google.com"
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
                value={weights.reading_progress}
                onChange={weights.setWeight}
              />%
            </div>
          </label>
          <p className={cn('valid-msg', { invalid: !weights.isValid })}>
            <Icon type="info-circle"/> Weights must total 100%
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={weights.saveWeights} disabled={!weights.isValid}>Save</Button>
          <Button onClick={weights.setDefaultWeights}>Restore default</Button>
          <Button onClick={weights.onCancelClick}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
