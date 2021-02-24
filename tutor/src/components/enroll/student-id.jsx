import { React, PropTypes } from 'vendor';
import { Modal, Button } from 'react-bootstrap';

export default function StudentIDForm({ enrollment }) {
    const onChange = ({ target: { value } }) => enrollment.student_identifier = value;
    return (
        <div className="enroll-form">
            <Modal.Body>
                <div className="title">
                    <p className="joining">You are joining</p>
                    <h4>{enrollment.courseName}</h4>
                </div>

                <div className="sub-title">Enter your school-issued student ID number</div>
                <div className="inputs">
                    <span className="student-id-icon"></span>
                    <input
                        autoFocus
                        onChange={onChange}
                        placeholder='School issued ID'
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" className="btn btn-success" onClick={enrollment.onStudentIdContinue}>Continue</Button>
                <Button className="cancel" variant="link" onClick={enrollment.onCancelStudentId}>Add it later</Button>
            </Modal.Footer>
        </div>
    );
}

StudentIDForm.propTypes = {
    enrollment: PropTypes.shape({
        student_identifier: PropTypes.string,
        courseName: PropTypes.string,
        onStudentIdContinue: PropTypes.func,
        onCancelStudentId: PropTypes. func,
    }).isRequired,
};
