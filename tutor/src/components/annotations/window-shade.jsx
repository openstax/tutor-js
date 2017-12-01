import React from 'react';

const WindowShade = ({ show, children }) => (
  <div className={`highlights-windowshade ${show ? 'down' : 'up'}`}>
    <div className='centered-content'>
      {children}
    </div>
  </div>
);

WindowShade.propTypes = {
  children: React.PropTypes.any.isRequired,
  show: React.PropTypes.bool.isRequired,
};

export default WindowShade;
