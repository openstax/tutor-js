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
class RenamePeriodField extends React.PureComponent {

  static propTypes = {
    label: React.PropTypes.object.isRequired,
    name:  React.PropTypes.string.isRequired,
    default: React.PropTypes.string.isRequired,
    onChange:  React.PropTypes.func.isRequired,
    autofocus: React.PropTypes.bool,
    validate: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    if (this.props.autofocus) { this.refs.input.focus(); }
    if (this.props.autofocus) { return this.refs.input.cursorToEnd(); }
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


@observer
export default class RenamePeriod extends React.PureComponent {

  static propTypes = {
    period: React.PropTypes.instanceOf(Period).isRequired,
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
            isWaiting={period.hasApiRequestPending}
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
      <Button onClick={this.open} bsStyle="link" className="control rename-period">
        <Icon type="pencil" /> Rename
        {this.renderForm()}
      </Button>
    );
  }

}
