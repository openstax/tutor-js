import PropTypes from 'prop-types';
import React from 'react';
import 'mobx-react';

export default class AbsentCell extends React.Component {

    static propTypes = {
        headings: PropTypes.array.isRequired,
        columnIndex: PropTypes.number.isRequired,
    }

    findTypeFromColumn() {
        const { headings, columnIndex } = this.props;
        return headings[columnIndex] ? headings[columnIndex].type : null;
    }

    render() {
        const columnType = this.findTypeFromColumn();

        if (columnType === 'external') {
            return (
                <div className="scores-cell">
                    <div className="worked not-started wide">
            ---
                    </div>
                </div>
            );
        } else {
            return (
                <div className="scores-cell">
                    <div className="score not-started">
            ---
                    </div>
                    <div className="worked not-started">
            ---
                    </div>
                </div>
            );
        }
    }
}
