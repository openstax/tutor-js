import PropTypes from 'prop-types';
import React from 'react';
import { find } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, modelize } from 'shared/model'
import { Modal, Button } from 'react-bootstrap';
import Router from '../../helpers/router';
import { TutorInput } from '../../components/tutor-input';
import { AsyncButton } from 'shared';
import CourseGroupingLabel from '../../components/course-grouping-label';
import { Icon } from 'shared';
import { Course, CoursePeriod } from '../../models';
import classnames from 'classnames';
import { hydrateModel } from 'vendor';

@observer
class AddPeriodField extends React.Component {

    static propTypes = {
        label: PropTypes.object.isRequired,
        name:  PropTypes.string.isRequired,
        onChange:  PropTypes.func.isRequired,
        validate: PropTypes.func.isRequired,
    }

    render() {
        return (
            <TutorInput
                ref="input"
                label={this.props.label}
                autoFocus
                default={''}
                hasValue
                required={true}
                onChange={this.props.onChange}
                validate={this.props.validate} />
        );
    }
}


@observer
export default
class AddPeriodLink extends React.Component {
    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
    }

    @observable showModal = Router.currentQuery().add;
    @observable period_name = '';
    @observable isValid = true;
    @observable isWaiting = false;

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

    @action.bound onPeriodChange(name) {
        this.period_name = name;
    }

    @action.bound validate(name) {
        this.isValid = !find(this.props.course.periods, { name });
    }

    @action.bound performUpdate() {
        this.isWaiting = true;
        const period = hydrateModel(CoursePeriod, { name: this.period_name }, this.props.course);
        period.save().then(() => {
            this.isWaiting = false;
            this.close();
        });
    }

    render() {
        const { course } = this.props;

        return (
            <React.Fragment>
                <Button onClick={this.open} variant="link" className="control add-period">
                    <Icon type="plus-square" />
                    Add <CourseGroupingLabel courseId={this.props.course.id} />
                </Button>
                <Modal
                    show={this.showModal}
                    onHide={this.close}
                    className="settings-edit-period-modal">
                    <Modal.Header closeButton={true}>
                        <Modal.Title>
                            Add <CourseGroupingLabel courseId={this.props.course.id} />
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className={classnames({ 'is-invalid-form': !this.isValid })}>
                        <AddPeriodField
                            label={<span><CourseGroupingLabel courseId={course.id} /> Name</span>}
                            name="period-name"
                            onChange={this.onPeriodChange}
                            validate={this.validate}
                            autofocus={true} />
                    </Modal.Body>
                    <Modal.Footer>
                        <AsyncButton
                            className="-edit-period-confirm"
                            onClick={this.performUpdate}
                            isWaiting={this.isWaiting}
                            waitingText="Adding..."
                            disabled={!this.isValid}
                        >
                            Add
                        </AsyncButton>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}
