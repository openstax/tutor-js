import React from 'react';

export default class extends React.Component {
  static displayName = 'PerformanceForecastColorKey';

  render() {
    return (
      <div className="guide-key">
        <div className="item high">
          <div className="progress-bar" />
          <span className="title">
            looking good
          </span>
        </div>
        <div className="item medium">
          <div className="progress-bar" />
          <span className="title">
            almost there
          </span>
        </div>
        <div className="item low">
          <div className="progress-bar" />
          <span className="title">
            keep trying
          </span>
        </div>
      </div>
    );
  }
}
