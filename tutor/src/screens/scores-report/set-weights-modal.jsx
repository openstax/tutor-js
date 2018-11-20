import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { snakeCase, map } from 'lodash';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import NewTabLink from '../../components/new-tab-link';
import { Icon } from 'shared';

const WEIGHTS = [
  'Homework scores',
  'Homework progress',
  'Reading scores',
  'Reading progress',
];

export default
@observer
class SetWeightsModal extends React.Component {

  static propTypes = {
    ux: PropTypes.object,
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
            cn({ 'page-loading loadable is-loading': true })
          }
        >
          <div>
            We recommend using homework scores and reading progress.
          </div>
          <NewTabLink
            href="https://openstax.org/blog/new-openstax-tutor-scoring-feature"
            className="set-weights--external-link"
          >
            See why
          </NewTabLink>
          <div className='weights-controls--wrapper'>
            {
              map(WEIGHTS, (weightLabel) => {
                const weightName = snakeCase(weightLabel);
                return (
                  <label className="weight" key={`weight-control-${weightName}`}>
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
              })
            }
            <div className='weights-set'>
              { !weights.isDefault?
                <Button
                  onClick={weights.setDefaults}
                  variant='link'
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
            waitingText={weights.savingButtonText}
            onClick={weights.onSaveWeights}
            disabled={!weights.isSaveable}
            variant={(weights.isSaveable && 'primary') || 'default'}
          >Save</AsyncButton>
          <Button
            variant="default"
            disabled={weights.isBusy}
            onClick={weights.onCancelClick}
            className={'btn-outline-secondary'}
          >Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
};
