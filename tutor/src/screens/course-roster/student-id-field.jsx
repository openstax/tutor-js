import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { observable, action, computed } from 'mobx';
import { Icon } from 'shared';
import Student from '../../models/course/student';

@observer
export default
class StudentIdField extends React.Component {

  static propTypes = {
      student: PropTypes.instanceOf(Student).isRequired,
  }

  @observable identifier = '';
  @observable isEditing = false;
  @observable input;

  @action.bound onUpdateId(ev) {
      this.identifier = ev.target.value;
  }

  @action.bound onEditId(ev) {
      ev.preventDefault();
      if (this.isEditing) { return; }
      this.isEditing = true;
      this.identifier = this.props.student.student_identifier;
  }

  @action.bound onEditBlur(ev) {
      ev.preventDefault();
      if (ev.relatedTarget === this.refs.editTrigger) {
          this.input.focus();
          return;
      }
      this.isEditing = false;
      if (this.identifier === this.props.student.student_identifier) {
          return;
      }
      this.props.student.student_identifier = this.identifier;
      this.props.student.saveStudentId().then(() => {
          this.identifier = null;
      });
  }

  @action.bound setInputRef(i) {
      this.input = i;
      if (this.input) {
          this.input.focus();
          this.input.select();
      }
  }

  renderInput() {
      return (
          <input
              type="text"
              ref={this.setInputRef}
              value={this.identifier}
              onChange={this.onUpdateId}
              onBlur={this.onEditBlur} />
      );
  }

  renderId() {
      return (
          <div className="identifier" onClick={this.onEditId}>
              {this.props.student.student_identifier}
          </div>
      );
  }

  @computed get hasError() {
      const { student } = this.props;
      return Boolean(
          !student.api.requestsInProgress && !isEmpty(student.api.errors)
      );
  }

  renderIcon() {
      if (this.hasError) {
          return (
              <Icon
                  type="exclamation-triangle"
                  tooltip="Student ID is already in use"
                  tooltipProps={{
                      placement: 'top',
                      trigger: ['hover', 'focus'],
                  }} />
          );
      }
      const busy = this.props.student.api.isPending;
      return (
          <Icon
              type={busy ? 'spinner' : 'edit'}
              spin={busy}
          />
      );
  }

  render() {
      return (
          <div className={classnames('student-id', { 'with-error': this.hasError })}>
              {this.isEditing ? this.renderInput() : this.renderId()}
              <a
                  href="#"
                  tabIndex={this.isEditing ? -1 : 0}
                  onClick={this.onEditId}
                  ref="editTrigger"
              >
                  {this.renderIcon()}
              </a>
          </div>
      );
  }
}
