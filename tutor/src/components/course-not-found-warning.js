import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import WarningModal from './warning-modal';
import TutorRouter from '../helpers/router';

const MESSAGES = {
    notAllowed: 'This page can only be viewed by the account holder.',
    notMember: 'You must be a member of this course to use this link. If your instructor sent you this link, ask your instructor for an enrollment link.',
};

@withRouter
class CourseNotFoundWarning extends React.Component {

    static propTypes = {
        areaName: PropTypes.string.isRequired,
        history: PropTypes.object.isRequired,
        messageType: PropTypes.oneOf(Object.keys(MESSAGES)),
    }

    static defaultProps = {
        areaName: 'course',
    }

    goToMyCourses = () => {
        this.props.history.push(TutorRouter.makePathname('myCourses'));
    }


    render() {
        const { areaName, messageType } = this.props;

        return (
            <WarningModal
                onDismiss={this.goToMyCourses}
                title={`Sorry, you can’t access this ${areaName}`}
                footer={<Button className="dismiss" onClick={this.goToMyCourses}>Close</Button>}
            >
                {MESSAGES[messageType] || MESSAGES.notMember}
            </WarningModal>
        );
    }
}

export { CourseNotFoundWarning };
