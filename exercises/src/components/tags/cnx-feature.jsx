import React from 'react';
import Exercise from '../../models/exercises/exercise';
import MultiInput from './multi-input';

class CnxFeature extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  validateInput = (value) => {
    if (!value.match(
      /^[\w\-]+$/i
    )) { return 'Must match feature ID'; }
  };

  cleanInput = (val) => {
    return (
      val.replace(/[^\w\-]/g, '')
    );
  };

  render() {
    return (
      <MultiInput
        {...this.props}
        label="CNX Feature"
        prefix="context-cnxfeature"
        cleanInput={this.cleanInput}
        placeholder="feature-id"
        validateInput={this.validateInput} />
    );
  }
}

export default CnxFeature;
