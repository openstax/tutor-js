import React from 'react';

const OXColoredStripe = () =>
  <div className="ox-colored-stripe">
    {['orange', 'blue', 'red', 'yellow', 'teal'].map((color) =>
      <div key={color} className={color} />)}
  </div>
;

OXColoredStripe.displayName = 'OXColoredStripe';

export default OXColoredStripe;
