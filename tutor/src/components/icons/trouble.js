import { React, PropTypes } from 'vendor';
import { Icon } from 'shared';
import Theme from '../../theme';

export default
function TroubleIcon({ plan, ...iconProps }) {
  if (!plan.is_trouble) { return null; }

  return (
    <Icon
      tooltip="Students may be having difficulty with this assignment"
      color={Theme.colors.danger}
      type="bookmark"
      rotation={90}
      {...iconProps}
    />
  );
}

TroubleIcon.propTypes = {
  plan: PropTypes.shape({
    is_trouble: PropTypes.bool,
  }).isRequired,
};
