import React from 'react';

export default class PerformanceForecastColorKey extends React.PureComponent {
  render() {
    return (
      <div className='guide-key'>
        <div className='item high'>
          <div className='progress-bar'></div>
          <span className='title'>looking good</span>
        </div>
        <div className='item medium'>
          <div className='progress-bar'></div>
          <span className='title'>almost there</span>
        </div>
        <div className='item low'>
          <div className='progress-bar'></div>
          <span className='title'>keep trying</span>
        </div>
      </div>
    );
  }
}
