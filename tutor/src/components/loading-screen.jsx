import React from 'react';
import OXFancyLoader from './ox-fancy-loader';

export default function LoadingScreen({ message = 'Loading…' }) {
  return (
    <div className="loading-screen-animation">
      <OXFancyLoader isLoading={true} />
      <h3>{message}</h3>
    </div>
  );
}

LoadingScreen.props = {
  message: React.PropTypes.string,
}
