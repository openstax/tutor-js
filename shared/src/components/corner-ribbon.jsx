import React from 'react';
import classnames from 'classnames';


export default function CornerRibbon({ hidden, label, fixed, shadow, color, position, children }) {
  return (
    <div className='corner-ribbon'>

      <div className={classnames('corner-ribbon-content', color, {
          fixed,
          shadow,
          hidden,
          'top-left':     position == 'topLeft',
          'top-right':    position == 'topRight',
          'bottom-right': position == 'bottomRight',
          'bottom-left':  position == 'bottomLeft',
      })}
      >{label}</div>
      {children}
    </div>
  );
}

CornerRibbon.propTypes = {
  position: React.PropTypes.oneOf(['topLeft', 'topRight', 'bottomRight', 'bottomLeft']),
  color: React.PropTypes.string,
  children: React.PropTypes.node,
  shadow: React.PropTypes.bool,
  fixed: React.PropTypes.bool,
  hidden: React.PropTypes.bool,
};
