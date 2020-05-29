import { React, PropTypes } from 'vendor';
import { Icon } from 'shared';

export default
function InfoIcon({ color = '2d6f9d', ...props }) {
  return <Icon color={color} type="info-circle" {...props} />;
}

InfoIcon.propTypes = {
  color: PropTypes.string,
};
