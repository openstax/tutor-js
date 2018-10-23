import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import Exercise from '../../models/exercises/exercise';
import { FormGroup, FormControl, ControlLabel } from 'react-bootstrap';
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
      <FormGroup controlId="mpq-toggle" className="mpq-toggle">
        <FormControl type="checkbox" ref="input" checked={showMPQ} onChange={this.onToggleMPQ} />
        <ControlLabel>
          Exercise contains multiple parts
        </ControlLabel>
      </FormGroup>;

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
