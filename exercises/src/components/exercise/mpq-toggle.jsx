import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import Exercise from '../../models/exercises/exercise';
import { Form } from 'react-bootstrap';
import { SuretyGuard } from 'shared';

@observer
class MPQToggle extends React.Component {
  static propTypes = {
      exercise: PropTypes.instanceOf(Exercise).isRequired,
  };

  @action.bound onConfirm() {
      this.props.exercise.toggleMultiPart();
  }

  @action.bound onToggleMPQ(ev) {
      // show warning if going from multi-part to multiple choice
      if (this.props.exercise.isMultiPart) {
          ev.preventDefault();
      } else {
          this.props.exercise.toggleMultiPart();
      }
  }

  render() {
      const showMPQ = this.props.exercise.isMultiPart;

      const checkbox =
      <Form.Group controlId="mpq-toggle" className="mpq-toggle">
          <Form.Control type="checkbox" ref="input" checked={showMPQ} onChange={this.onToggleMPQ} />
          <Form.Label>
          Exercise contains multiple parts
          </Form.Label>
      </Form.Group>;

      if (showMPQ) {
          return (
              <SuretyGuard
                  onConfirm={this.onConfirm}
                  okButtonLabel="Convert"
                  placement="left"
                  message={`
              If this exercise is converted to be multiple-choice,
              the intro and all but the first question will be
              removed.`
                  }
              >
                  {checkbox}
              </SuretyGuard>
          );
      }

      return checkbox;
  }
}

export default MPQToggle;
