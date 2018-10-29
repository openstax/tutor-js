import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import { Modal, Button } from 'react-bootstrap';
import { AsyncButton } from 'shared';
import classnames from 'classnames';

import Period from '../../models/course/period';
import { TutorInput } from '../tutor-input';
import Icon from '../icon';
import CourseGroupingLabel from '../course-grouping-label';


@observer
class RenamePeriodField extends React.Component {

  static propTypes = {
    label: PropTypes.object.isRequired,
    name:  PropTypes.string.isRequired,
    default: PropTypes.string.isRequired,
    onChange:  PropTypes.func.isRequired,
    autofocus: PropTypes.bool,
    validate: PropTypes.func.isRequired,
  }

  componentDidMount() {
    if (this.props.autofocus) { this.refs.input.focus(); }
    if (this.props.autofocus) { this.refs.input.cursorToEnd(); }
  }

  render() {
    return (
      <TutorInput
        ref="input"
        label={this.props.label}
        default={this.props.default}
        required={true}
        onChange={this.props.onChange}
        validate={this.props.validate} />
    );
  }
}


export default
@observer
class RenamePeriod extends React.Component {

  static propTypes = {
    period: PropTypes.instanceOf(Period).isRequired,
  }


  @observable showModal = false;
  @observable isValid = true;
  @observable newName = '';

  @action.bound close() {
    this.showModal = false;
  }

  @action.bound open() {
    this.showModal = true;
  }

  @action.bound validate(name) {
    this.isValid = this.props.period.isNameValid(name);
  }

  @action.bound onChange(name) {
    this.newName = name;
  }

  @action.bound performUpdate() {
    if (this.isValid) {
      this.props.period.name = this.newName;
      this.props.period.save().then(this.close);
    }
  }

  @computed get course() {
    return this.props.period.course;
  }

  renderForm() {
    const { period } = this.props;

    return (
      <Modal
        show={this.showModal}
        onHide={this.close}
        className="settings-edit-period-modal">
        <Modal.Header closeButton={true}>
          <Modal.Title>
            Rename <CourseGroupingLabel courseId={this.course.id} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={classnames({ 'is-invalid-form': !this.isValid })}>
          <RenamePeriodField
            label={
              <span><CourseGroupingLabel courseId={this.course.id} /> Name</span>
            }
            name="period-name"
            default={this.props.period.name}
            onChange={this.onChange}
            validate={this.validate}
            autofocus={true}
          />
        </Modal.Body>
        <Modal.Footer>
          <AsyncButton
            className="-edit-period-confirm"
            onClick={this.performUpdate}
            isWaiting={period.api.isPending}
            waitingText="Saving..."
            disabled={!this.isValid}
          >
            Rename
          </AsyncButton>
        </Modal.Footer>
      </Modal>
    );
  }

  render() {
    return (
      <Button onClick={this.open} variant="link" className="control rename-period">
        <Icon type="pencil" /> Rename
        {this.renderForm()}
      </Button>
    );
  }

};
