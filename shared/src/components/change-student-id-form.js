import PropTypes from 'prop-types';
import React from 'react';
import { Form } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import AsyncButton from './buttons/async-button';
import classnames from 'classnames';

const ENTER = 'Enter';

const BlankWarning = props =>
    <div className={classnames('blank-warning', { visible: isEmpty(props.value) })}>
        {'\
  An ID is required for credit. You have not yet entered an ID\
  '}
    </div>
;

BlankWarning.propTypes = {
    value: PropTypes.string,
};

class ChangeStudentIdForm extends React.Component {
  static propTypes = {
      onCancel: PropTypes.func.isRequired,
      onSubmit: PropTypes.func.isRequired,
      studentId: PropTypes.string,
      children: PropTypes.node,
      isBusy: PropTypes.bool,
      label: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
      ]).isRequired,

      saveButtonLabel: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
  };

  state = { studentId: this.props.studentId };

  onCancel = (ev) => {
      ev.preventDefault();
      return this.props.onCancel();
  };

  onKeyPress = (ev) => {
      if (ev.key === ENTER) { this.onSubmit(); }
  };

  onSubmit = () => {
      return this.props.onSubmit(this.state.studentId);
  };

  UNSAFE_componentWillReceiveProps(newProps) {
      return this.setState({ studentId: newProps.studentId });
  }

  handleChange = (ev) => {
      return this.setState({ studentId: ev.target.value });
  };

  render() {
      return (
          <div className="openstax-change-student-id-form">
              <h2 className="title">
                  {this.props.title}
              </h2>
              {this.props.children}
              <div className="controls">
                  <div className="main">
                      <Form.Label>
                          {this.props.label}
                      </Form.Label>
                      <div className="inputs">
                          <input
                              autoFocus={true}
                              placeholder="School issued ID"
                              defaultValue={this.state.studentId}
                              onChange={this.handleChange}
                              onKeyPress={this.onKeyPress} />
                          <AsyncButton
                              variant="primary"
                              className="btn btn-success"
                              isWaiting={!!this.props.isBusy}
                              waitingText="Confirming…"
                              onClick={this.onSubmit}>
                              {this.props.saveButtonLabel}
                          </AsyncButton>
                      </div>
                      <BlankWarning value={this.state.studentId} />
                  </div>
                  <div className="cancel">
                      <a href="#" onClick={this.onCancel}>
              Cancel
                      </a>
                  </div>
              </div>
              <div className="ask-for-it">
                  {'\
    Don’t have one? Contact your instructor.\
    '}
              </div>
          </div>
      );
  }
}

export default ChangeStudentIdForm;
