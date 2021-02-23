import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { snakeCase, map } from 'lodash';
import { Modal, Button } from 'react-bootstrap';

const WEIGHTS = [
  'Homework scores',
  'Homework progress',
  'Reading scores',
  'Reading progress',
];

@observer
export default
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
                        readOnly
                      />%
                    </div>
                  </label>
                );
              })
            }
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="default"
            disabled={weights.isBusy}
            onClick={weights.onCancelClick}
            className={'btn-outline-secondary'}
          >Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
