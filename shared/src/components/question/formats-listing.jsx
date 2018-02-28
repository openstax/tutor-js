import React from 'react';
import { observer } from 'mobx-react';

@observer
export default class FormatsListing extends React.Component {
  static propTypes = {
    formats: React.PropTypes.arrayOf(React.PropTypes.string).isRequired,
  };

  static defaultProps = { formats: [] };

  render() {
    return (
      <div className="formats-listing">
        <div className="header">
          Formats:
        </div>
        {Array.from(this.props.formats).map((format, i) =>
          <span key={i}>
            {format}
          </span>)}
      </div>
    );
  }
}
