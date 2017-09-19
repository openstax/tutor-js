/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const BS = require('react-bootstrap');
const moment = require('moment-timezone');

const _ = require('underscore');
const {CourseStore, CourseActions} = require('../../flux/course');
const {AsyncButton} = require('shared');
const {TutorRadio} = require('../tutor-input');
const classnames = require('classnames');

const {TimeStore} = require('../../flux/time');
const TimeHelper = require('../../helpers/time');
const S = require('../../helpers/string');

const PropTypes =
  {Timezone: React.PropTypes.oneOf(_.values(TimeHelper.getTimezones()))};


const TimezonePreview = React.createClass({
  displayName: 'TimezonePreview',
  timezone: PropTypes.Timezone.isRequired,
  getDefaultProps() {
    return (
        {
          time: moment(),
          interval: 60000
        }
    );
  },

  getInitialState() {
    const {time} = this.props;

    return (

        {
          timeout: null,
          time
        }

    );
  },

  componentWillMount() {
    return (
        this.update()
    );
  },

  componentWillUnmount() {
    const {timeout} = this.state;
    return (
        clearTimeout(timeout)
    );
  },

  update() {
    const {interval} = this.props;

    const timeout = setTimeout( () => {
      this.updateTime();
      return (
          this.update()
      );
    }
    , interval);

    return (

        this.setState({timeout})

    );
  },

  updateTime() {
    const {interval} = this.props;
    const {time} = this.state;

    const updatedTime = time.clone().add(interval, 'ms');
    return (
        this.setState({time: updatedTime})
    );
  },

  render() {
    const {timezone} = this.props;
    const {time} = this.state;
    const timePreview = time.tz(timezone).format('h:mm a');

    return (

        (
          <span className="timezone-preview">
            {timePreview}
          </span>
        )

    );
  }
});


const SetTimezoneField = React.createClass({
  displayName: 'SetTimezoneField',
  propTypes: {
    courseId: React.PropTypes.string,
    name: React.PropTypes.string.isRequired,
    defaultValue: PropTypes.Timezone.isRequired,
    onChange: React.PropTypes.func.isRequired,
    autofocus: React.PropTypes.bool,
    validate: React.PropTypes.func.isRequired
  },

  getInitialState() {
    const {defaultValue} = this.props;
    return (
        {courseTimezone: defaultValue}
    );
  },

  onChange(changeEvent, changeData) {
    const {value} = changeData;
    this.setState({courseTimezone: value});
    return (
        (typeof this.props.onChange === 'function' ? this.props.onChange(value) : undefined)
    );
  },

  render() {
    const timezones = TimeHelper.getTimezones();
    const {name} = this.props;
    const {courseTimezone} = this.state;

    const timezonesToPick = _.map(timezones, timezone => {
      const identifier = S.dasherize(timezone);

      return (

          (
            <TutorRadio
              id={identifier}
              key={`timezone-choice-${identifier}`}
              value={timezone}
              name={name}
              checked={timezone === courseTimezone}
              onChange={this.onChange} />
          )

      );
    });

    return (

        (
          <div>
            {timezonesToPick}
            <p className="course-timezone-preview">
              <span className="course-timezone-preview-description">
                Your course time will be:
              </span>
              <strong className="course-timezone-preview-value">
                <TimezonePreview timezone={courseTimezone} />
              </strong>
            </p>
          </div>
        )

    );
  }
});


const SetTimezone = React.createClass({
  propTypes: {
    courseId: React.PropTypes.string.isRequired
  },

  getInitialState() {
    return (
        {
          course_timezone: CourseStore.getTimezone(this.props.courseId),
          showModal: false
        }
    );
  },

  close() {
    return (
        this.setState({showModal: false})
    );
  },

  open() {
    return (
        this.setState({showModal: true})
    );
  },

  validate(timezone) {
    let error;
    if (!TimeHelper.isTimezoneValid(timezone)) { error = ['review']; }
    this.setState({invalid: (error != null)});
    return (
        error
    );
  },

  performUpdate() {
    if (!this.state.invalid) {
      CourseActions.save(this.props.courseId, {time_zone: this.state.course_timezone});
      return (
          CourseStore.once('saved', () => {
            return this.close()
      );
      });
    }
  },

  renderForm() {
    const invalid = this.state != null ? this.state.invalid : undefined;
    return (
        (
          <BS.Modal
            show={this.state.showModal}
            onHide={this.close}
            className="settings-edit-course-modal">
            <BS.Modal.Header closeButton={true}>
              <BS.Modal.Title>
                Change Course Timezone
              </BS.Modal.Title>
            </BS.Modal.Header>
            <BS.Modal.Body className={classnames({'is-invalid-form': invalid})}>
              <SetTimezoneField
                name="course-timezone"
                defaultValue={CourseStore.getTimezone(this.props.courseId)}
                onChange={val => this.setState({course_timezone: val})}
                validate={this.validate}
                autofocus={true} />
            </BS.Modal.Body>
            <BS.Modal.Footer>
              <AsyncButton
                className="-edit-course-confirm"
                onClick={this.performUpdate}
                isWaiting={CourseStore.isSaving(this.props.courseId)}
                waitingText="Saving..."
                disabled={invalid}>
                {`\
        Save\
        `}
              </AsyncButton>
            </BS.Modal.Footer>
          </BS.Modal>
        )
    );
  },

  render() {
    return (
        (
          <BS.Button onClick={this.open} bsStyle="link" className="control edit-course">
            <i className="fa fa-pencil" />
            {` Change Course Timezone\
        `}
            {this.renderForm()}
          </BS.Button>
        )
    );
  }
});


module.exports = SetTimezone;
