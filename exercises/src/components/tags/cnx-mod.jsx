import React from 'react';
import Exercise from '../../models/exercises/exercise';
import MultiInput from './multi-input';

class CnxModTag extends React.Component {
  static propTypes = {
    exercise: React.PropTypes.instanceOf(Exercise).isRequired,
  };

  validateInput = (value) => {
    if (!value.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )) { return 'Must match CNX module ID (without version number)'; }
  };

  cleanInput = (val) => {
    return val.replace(/[^0-9a-f-]/g, '');
  }

  render() {
    return (
      <MultiInput
        {...this.props}
        label="CNX Module"
        type="context-cnxmod"
        cleanInput={this.cleanInput}
        validateInput={this.validateInput}
        placeholder="########-####-####-####-############" />
    );
  }
}

export default CnxModTag;
