import React from 'react';
import { observer } from 'mobx-react';
import { ArrayOrMobxType } from '../../helpers/react';

@observer
export default
class FormatsListing extends React.Component {
  static propTypes = {
    formats: ArrayOrMobxType.isRequired,
  };

  static defaultProps = { formats: [] };

  render() {
    const { formats } = this.props;

    return (
      <div className="formats-listing">
        <div className="header">Formats:</div>
        {formats.map((format, i) => <span key={i}>{format.asString}</span>)}
      </div>
    );
  }
}
