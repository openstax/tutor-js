import { React, PropTypes, observer } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';
import UX from './ux';

const SortingIcon = observer(({ ux, sortKey, dataType }) => {
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
