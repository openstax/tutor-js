import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, modelize } from 'shared/model'
import { Modal } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import Courses from '../../models/courses-map';
import Course from '../../models/course';
import { TutorInput } from '../../components/tutor-input';
import { Icon } from 'shared';


@observer
export default
class RenameCourse extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @observable showModal = false;
    @observable isValid = true;
    @observable newName = '';

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound close() {
        this.showModal = false;
    }

    @action.bound open() {
        this.showModal = true;
    }

    @action.bound validate(name) {
        this.isValid = (
            name != this.props.course.name && Courses.isNameValid(name)
        );
    }

    @action.bound onChange(name) {
        this.newName = name;
    }

    @action.bound
    performUpdate() {
        if (this.isValid) {
            this.props.course.name = this.newName;
            this.props.course.save().then(this.close);
        }
    }

    render() {
        const { course } = this.props;

        return (
            <React.Fragment>
                <Icon onClick={this.open} className="control edit-course" type="pencil-alt" />
                <Modal
                    show={this.showModal}
                    onHide={this.close}
                    className="settings-edit-course-modal">
                    <Modal.Header closeButton={true}>
                        <Modal.Title>
                Rename Course
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <TutorInput
                            label="Course Name"
                            ref={i => this.input = i}
                            name="course-name"
                            onChange={this.onChange}
                            default={course.name}
                            validate={this.validate}
                            autoFocus />
                    </Modal.Body>
                    <div className="modal-footer">
                        <AsyncButton
                            className="-edit-course-confirm"
                            onClick={this.performUpdate}
                            isWaiting={course.api.isPending}
                            waitingText="Saving..."
                            disabled={false === this.isValid}
                        >
                Rename
                        </AsyncButton>
                    </div>
                </Modal>
            </React.Fragment>
        );
    }
}
