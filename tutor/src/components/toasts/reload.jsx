import React from 'react';
import ReloadButton from '../buttons/reload-page';

const ReloadToast = () => (
  <div className="toast neutral reload">
    <div className="title">
      <span>Updates available</span>
    </div>
    <div className="body">
      <p>
        This page needs to be reloaded.
      </p>
      <ReloadButton>Reload</ReloadButton>
    </div>
  </div>
);

export default ReloadToast;
