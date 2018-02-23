import React from 'react';
import { observer, PropTypes as MobxPropTypes } from 'mobx-react';
import cn from 'classnames';
import { snakeCase, map } from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import ExternalLink from '../../components/new-tab-link';
import Icon from '../../components/icon';

const WEIGHTS = [
  'Homework scores',
  'Homework progress',
  'Reading scores',
  'Reading progress',
];

const WeightControl = ( { weightLabel, weightName, weights } ) => (
  <label className="weight">
    <div>{weightLabel}</div>
    <div>
      <input
        type="number"
        name={weightName}
        min={0}
        max={100}
        value={weights[weightName]}
        onChange={weights.setWeight}
      />%
    </div>
  </label>
);


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
          <div className='weights-controls--wrapper'>
            {
              map(WEIGHTS, (weightLabel) => {
                const weightName = snakeCase(weightLabel);
                return (<WeightControl
                  weightLabel={weightLabel}
                  weightName={weightName}
                  weights={weights}
                  key={`weight-control-${weightName}`}
                />);
              })
            }
            <div className='weights-set'>
            { !weights.isDefault?
              <Button
                onClick={weights.setDefaults}
                bsStyle='link'
              >Restore default</Button>
              : null
            }
            </div>
          </div>
          <p className={cn('weights-msg', {
              invalid: weights.showIsInvalid,
              valid: weights.showIsValid,
          })}>
            <Icon type={weights.msgIconType}/>{weights.msg}
          </p>
        </Modal.Body>
        <Modal.Footer>
          <AsyncButton
            isWaiting={weights.isBusy}
            waitingText='Saving…'
            onClick={weights.onSaveWeights}
            disabled={!weights.isSaveable}
            bsStyle={(weights.isSaveable && 'primary') || 'default'}
          >Save</AsyncButton>
          <Button
            onClick={weights.onCancelClick}
            className={'btn-outline-secondary'}
          >Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
