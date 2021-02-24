import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import cn from 'classnames';
import { Modal, Button } from 'react-bootstrap';

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
              onHide={weights.onCancelClick}
              className="set-weights view-weights"
          >
              <Modal.Header closeButton>
          How your instructor adds up your work
              </Modal.Header>
              <Modal.Body
                  className={
                      cn({ 'page-loading loadable is-loading': true })
                  }
              >
                  <p className="header">Counts for</p>
                  <label className="weight">
                      <div>Homework scores</div>
                      <div>
                          {weights.homework_scores}%
                      </div>
                  </label>
                  <label className="weight">
                      <div>Homework progress</div>
                      <div>
                          {weights.homework_progress}%
                      </div>
                  </label>
                  <label className="weight">
                      <div>Reading scores</div>
                      <div>
                          {weights.reading_scores}%
                      </div>
                  </label>
                  <label className="weight">
                      <div>Reading progress</div>
                      <div>
                          {weights.reading_progress}%
                      </div>
                  </label>
              </Modal.Body>
              <Modal.Footer>
                  <Button
                      onClick={weights.onCancelClick}
                      className={'btn-outline-secondary'}
                  >Close</Button>
              </Modal.Footer>
          </Modal>
      );
  }
}
