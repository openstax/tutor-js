import PropTypes from 'prop-types';
import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import S from '../helpers/string';
import TaskHelper from '../helpers/task';

// eslint-disable-next-line react/prefer-stateless-function
export default class LateIcon extends React.Component {

    static defaultProps = {
        buildLateMessage(task, status) {
            return `${S.capitalize(task.type)} was ${status.how_late} late`;
        },
    };

    static propTypes = {
        task: PropTypes.shape({
            id: PropTypes.any,
            due_at:          PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.instanceOf(Date),
            ]),
            last_worked_at:  PropTypes.date,
            type:            PropTypes.string,
            status:          PropTypes.string,
        }).isRequired,
        className:        PropTypes.string,
        buildLateMessage: PropTypes.func,
    };

    render() {
        const { task, className, buildLateMessage } = this.props;
        const status = TaskHelper.getLateness(task);

        if ((task.status === 'not_started') || !status.is_late) { return null; }

        let classes = 'late';
        if (className != null) { classes += ` ${className}`; }

        const tooltip = <Tooltip id={`late-icon-tooltip-${task.id}`}>
            {buildLateMessage(task, status)}
        </Tooltip>;
        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <i className={classes} />
            </OverlayTrigger>
        );
    }
}
