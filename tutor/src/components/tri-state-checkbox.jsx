import PropTypes from 'prop-types';
import React from 'react';
import { keys } from 'lodash';
import classnames from 'classnames';
import Theme from '../theme';
import { Icon } from 'shared';

const ICON_TYPES = {
    partial:   'check-square',
    checked:   'check-square-solid',
    unchecked: 'square',
};

let COLORS = {
    partial: Theme.colors.neutral.lite,
    checked: '#4b89f5', // chrome's checked color
    unchecked: Theme.colors.neutral.lite,
};

class TriStateCheckbox extends React.Component {
    static propTypes = {
        type: PropTypes.oneOf(keys(ICON_TYPES)).isRequired,
        onClick: PropTypes.func,
        checkedColor: PropTypes.string,
    };

    constructor(props){
        super(props);
        if(props.checkedColor) {
            COLORS.checked = props.checkedColor;
        }
    }

    onClick = (ev) => {
        ev.preventDefault();
        if (this.props.onClick) {
            this.props.onClick(ev);
        }
    };

    render() {
        let styles;
        if (this.props.onClick) {
            styles = { cursor: 'pointer' };
        }
        const classNames = classnames('tri-state-checkbox', this.props.type);
        return (
            <span tabIndex={1} className={classNames} onClick={this.onClick}>
                <Icon
                    color={COLORS[this.props.type]}
                    type={ICON_TYPES[this.props.type]}
                    onClick={this.props.onClick}
                    style={styles} />
            </span>
        );
    }
}

export default TriStateCheckbox;
