import { React, PropTypes, observer, modelize } from 'vendor'
import { map } from 'lodash';
import { ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { autobind } from 'core-decorators';
import UX from './ux';

const FILTERS = {
    '%': 'percentage',
    '#': 'number',
};

@observer
export default
class TableFilters extends React.Component {
    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @autobind renderButton(filter, label) {
        return (
            <ToggleButton
                value={filter}
                key={filter}
            >
                {label}
            </ToggleButton>
        );
    }

    render() {
        const { ux } = this.props;
        return (
            <div className="filter-row">
        Display as
                <ToggleButtonGroup
                    value={ux.displayValuesAs}
                    onChange={ux.onChangeDisplayValuesAs}
                    size="small"
                    name="filter-by"
                    className="filter-group"
                >
                    {map(FILTERS, this.renderButton)}
                </ToggleButtonGroup>
            </div>
        );
    }
}
