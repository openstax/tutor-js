import { React, PropTypes, useObserver } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';
import UX from './ux';

const SortingIcon = ({ ux, sortKey, dataType }) => useObserver(() => {
  const isSorted = ux.isRowSortedBy({ sortKey, dataType });
  return (
    <Icon
      type={isSorted ? `sort-${ux.rowSort.asc ? 'up' : 'down'}` : 'sort'}
      color={isSorted ? colors.states.active : colors.states.disabled}
    />

  );
});


SortingIcon.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
  sortKey: PropTypes.any.isRequired,
  className: PropTypes.string,
  dataType: PropTypes.string,
  type: PropTypes.string,
  children: PropTypes.element,
};

export default SortingIcon;
