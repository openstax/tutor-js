import PropTypes from 'prop-types';
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
  position: PropTypes.oneOf(['topLeft', 'topRight', 'bottomRight', 'bottomLeft']),
  color: PropTypes.string,
  children: PropTypes.node,
  shadow: PropTypes.bool,
  fixed: PropTypes.bool,
  hidden: PropTypes.bool,
};
