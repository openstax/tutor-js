import PropTypes from 'prop-types';
import React from 'react';
import { computed, action, modelize } from 'shared/model'
import { observer } from 'mobx-react';
import TourAnchor from '../../components/tours/anchor';
import { Icon } from 'shared';
import { Course, LmsScorePushJob as Push } from '../../models';

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
        return Push.forCourse(this.props.course);
    }

    @action.bound startPush() {
        this.lmsPush.start();
    }

    @computed get message() {
        if (this.lmsPush.isPending) {
            return <span className="busy">Sending course averages to LMS…</span>;
        }
        const { lastPushedAt } = this.lmsPush;
        if (lastPushedAt) {
            return <span>Last sent to LMS: {lastPushedAt}</span>;
        }
        return <span>Send individual course averages to LMS</span>;
    }

    render() {
        const { course } = this.props;
        if (!course.is_lms_enabled) { return null; }

        return (
            <TourAnchor className="scores-push" id="scores-export-button">
                <Icon onClick={this.startPush} type="paper-plane" />
                {this.message}
            </TourAnchor>
        );
    }
}
