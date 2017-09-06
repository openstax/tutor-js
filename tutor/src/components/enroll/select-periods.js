import React from 'react';
import { observer } from 'mobx-react';
import { Listing, Choice } from '../choices-listing';
import { Modal, Button } from 'react-bootstrap';

@observer
export default class SelectPeriod extends React.PureComponent {

  static propTypes = {
    enrollment: React.PropTypes.object.isRequired,
  }

  render() {
    const { enrollment, enrollment: { courseToJoin: course } } = this.props;

    return (
      <div className="enroll-form periods">
        <Modal.Body>
          <div className="title">
            <p className="joining">You are joining</p>
            <h3>{course.name}</h3>
          </div>
          <p>Please select the section you are a member of</p>
          <Listing>
            {course.periods.map(pr => (
              <Choice key={pr.enrollment_code}
                record={pr}
                onClick={enrollment.selectPeriod}
                active={pr.enrollment_code == enrollment.enrollment_code}
                >
                {pr.name}
              </Choice>
            ))}
          </Listing>
        </Modal.Body>
        <Modal.Footer>
          <Button bsStyle="primary" className="btn btn-success" onClick={enrollment.onSubmitPeriod}>
            Continue
          </Button>
        </Modal.Footer>
      </div>
    );
  }
}
