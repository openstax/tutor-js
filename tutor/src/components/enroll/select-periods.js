import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { Listing, Choice } from '../choices-listing';
import { Modal, Button } from 'react-bootstrap';

@observer
export default class SelectPeriod extends React.Component {

    static propTypes = {
        enrollment: PropTypes.object.isRequired,
    }

    render() {
        const { enrollment, enrollment: { courseToJoin: course } } = this.props;
        return (
            <div className="enroll-form periods">
                <Modal.Body>
                    <div className="title">
                        <p className="joining">You are joining</p>
                        <h4>{course.name}</h4>
                    </div>
                    <p>
            Please select the OpenStax Tutor section you are a member of.
            If you don't know which section to select, ask your instructor.
                    </p>
                    <Listing>
                        {course.periods.map(pr => (
                            <Choice key={pr.enrollment_code}
                                record={pr}
                                onClick={enrollment.selectPeriod}
                                active={pr.enrollment_code == enrollment.pendingEnrollmentCode}
                            >
                                {pr.name}
                            </Choice>
                        ))}
                    </Listing>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        disabled={!enrollment.periodIsSelected}
                        variant="primary"
                        className="btn btn-success" onClick={enrollment.onSubmitPeriod}>
            Continue
                    </Button>
                </Modal.Footer>
            </div>
        );
    }
}
