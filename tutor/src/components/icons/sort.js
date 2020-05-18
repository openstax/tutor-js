import { React, PropTypes, observer } from 'vendor';
import { Icon } from 'shared';

const SortIcon = observer(({ sort }) => {
  let icon;
  if (!sort) {
    icon = 'sort';
  } else if (sort.asc) {
    icon = 'sort-up';
  } else {
    icon = 'sort-down';
  }
  return <Icon data-purpose="sort" type={icon} />;
});
SortIcon.propTypes={
  sort: PropTypes.oneOfType([ PropTypes.object, PropTypes.bool ]),
};

export default SortIcon;
