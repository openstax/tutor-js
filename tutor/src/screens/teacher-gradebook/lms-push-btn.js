import PropTypes from 'prop-types';
import React from 'react';
import { computed, action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import { Icon, AsyncButton } from 'shared';
import { Course, LmsScorePushJob } from '../../models';

@observer
export default
class LmsPush extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get lmsPush() {
        return LmsScorePushJob.forCourse(this.props.course);
    }

    @action.bound startPush() {
        this.lmsPush.start();
    }

    render() {
        const { course } = this.props;
        const { lastPushedAt } = this.lmsPush;

        if (!course.is_lms_enabled) { return null; }

        const popover = (
            <Popover className="scores-popover">
                <p>Export Course average to {course.name}</p>
                {lastPushedAt && <p>Last sent to LMS: <strong>{lastPushedAt}</strong></p>}
            </Popover>
        );
        return (
            <>
                <OverlayTrigger placement="bottom" overlay={popover} trigger="hover">
                    <AsyncButton
                        variant='plain'
                        isWaiting={this.lmsPush.isPending}
                        waitingText="Sending course averages to LMS…"
                        onClick={this.startPush}
                        data-test-id="lms-push">
                        <Icon type="paper-plane" />
                    </AsyncButton>
                </OverlayTrigger>

            </>
        );
    }
}
