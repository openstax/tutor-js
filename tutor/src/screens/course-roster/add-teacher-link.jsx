import PropTypes from 'prop-types';
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import CopyOnFocusInput from '../../components/copy-on-focus-input';
import Course from '../../models/course';
import { Icon } from 'shared';

@observer
export default
class AddTeacherLink extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @observable isShown = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onClose() {
        this.isShown = false;
    }

    @action.bound onShow() {
        this.isShown = true;
    }

    render() {
        const { course } = this.props;
        return (
            <React.Fragment>
                <Button
                    onClick={this.onShow}
                    variant="link"
                    className="control add-teacher">
                    <Icon type="user-plus" />
            Add Instructor
                </Button>
                <Modal
                    size="lg"
                    show={this.isShown}
                    onHide={this.onClose}
                    className="settings-add-instructor-modal"
                >
                    <Modal.Header closeButton={true}>
                        <Modal.Title>
                Add Teacher
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                Share this link with an instructor so they can add themselves to the course:
                        </p>
                        <CopyOnFocusInput value={course.roster.teach_url || ''} focusOnMount={true} />
                        <p className="warning">
                            <Icon type="exclamation-triangle" /> Do not share this link with students
                        </p>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
}
