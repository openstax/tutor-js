import PropTypes from 'prop-types';
import React from 'react';
import Icon from '../icon';

class CourseHasEndedNotification extends React.Component {
    static displayName = 'CourseHasEndedNotification';

    static propTypes = {
        callbacks: PropTypes.shape({
            onCCSecondSemester: PropTypes.func.isRequired,
        }),

        notice: PropTypes.shape({
            id: PropTypes.oneOfType([
                PropTypes.number,
                PropTypes.string,
            ]),
        }),
    };

    onSecondSemesterClick = () => {
        return this.props.callbacks.onCCSecondSemester(this.props.notice);
    };

    actionsLink = () => {
        if (!(this.props.callbacks != null ? this.props.callbacks.onCCSecondSemester : undefined)) { return null; }
        return (
            <a className="action" onClick={this.onSecondSemesterClick}>
                {'\
    Click to enroll in second semester\
    '}
            </a>
        );
    };

    render() {
        return (
            <div className="notification course-has-ended">
                <span className="body">
                    <Icon type="info-circle" />
                    <span>
            This course has ended.
                    </span>
                    {this.actionsLink()}
                </span>
            </div>
        );
    }
}

export default CourseHasEndedNotification;
