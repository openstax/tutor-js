import PropTypes from 'prop-types';
import React from 'react';
import { action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon } from 'shared';
import Name from '../../components/name';
import { AsyncButton } from 'shared';
import { Course, CourseTeacher }from '../../models'

const WARN_REMOVE_CURRENT = 'If you remove yourself from the course you will be redirected to the dashboard.';


@withRouter
@observer
export default
class RemoveTeacherLink extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
        teacher: PropTypes.instanceOf(CourseTeacher).isRequired,
        history: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound goToDashboard() {
        window.location = '/courses'
    }

    @action.bound performDeletion() {
        const request = this.props.teacher.drop();
        if (this.props.teacher.isTeacherOfCourse) {
            request.then(this.goToDashboard);
        }
    }

    confirmPopOver() {
        const { teacher } = this.props;

        return (
            <Popover
                id={`settings-remove-popover-${teacher.id}`}
                className="settings-remove-teacher"
            >
                <Popover.Title>
                    <span>Remove <Name {...teacher} />?</span>
                </Popover.Title>
                <Popover.Content>

                    <AsyncButton
                        variant="danger"
                        data-test-id="remove-confirm-btn"
                        onClick={this.performDeletion}
                        isWaiting={teacher.api.isPending}
                        waitingText="Removing..."
                    >
                        <Icon type="ban" /> Remove
                    </AsyncButton>

                    <div className="warning">
                        {teacher.isTeacherOfCourse ? WARN_REMOVE_CURRENT : undefined}
                    </div>
                </Popover.Content>
            </Popover>
        );
    }

    render() {
        return (
            <OverlayTrigger
                rootClose={true}
                trigger="click"
                placement="left"
                overlay={this.confirmPopOver()}
            >
                <a className="remove">
                    <Icon type="ban" />
                    {' Remove'}
                </a>
            </OverlayTrigger>
        );
    }
}
