import PropTypes from 'prop-types';
import React from 'react';
import { Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import { delay, isEmpty, isUndefined, omit } from 'underscore';
import { TutorDateInput, TutorTimeInput } from '../../tutor-input';
import { AsyncButton } from 'shared';

class DateTime extends React.Component {
  static defaultProps = { messageTime: 2000 };

  static propTypes = {
    value:          PropTypes.string,
    defaultValue:   PropTypes.string.isRequired,
    isSetting:      PropTypes.func.isRequired,
    timeLabel:      PropTypes.string.isRequired,
    setDefaultTime: PropTypes.func.isRequired,
    messageTime:    PropTypes.number,
  };

  state = this.getStateFromProps(this.props, this.props.defaultValue);

  componentDidUpdate(prevProps, prevState) {
    if (this.isJustSet(prevProps, prevState)) {
      const { messageTime } = this.props;

      this.setState({ justSet: true });
      return delay(() => {
        return this.setState({ justSet: false, setClicked: null });
      }
        , messageTime);
    }
  }

  onDateChange = (date) => {
    this.setState({ date });
    return (typeof this.props.setDate === 'function' ? this.props.setDate(date) : undefined);
  };

  onTimeChange = (time) => {
    this.setState({ time });
    return (typeof this.props.setTime === 'function' ? this.props.setTime(time) : undefined);
  };

  onTimeUpdated = () => {
    return this.setState({ isTimeValid: this.isTimeValid(), isTimeDefault: this.isTimeDefault() });
  };

  getStateFromProps = (props = this.props, time) => {
    const { value, defaultValue, isSetting } = props;

    return {
      date: value,
      time: defaultValue,
      justSet: false,
      isSetting: isSetting(),
      isTimeValid: this.isTimeValid(time),
      isTimeDefault: this.isTimeDefault(time, props),
    };
  };

  setDefaultTime = () => {
    const { timeLabel, setDefaultTime } = this.props;
    const { time } = this.state;

    const timeChange = {};
    timeChange[timeLabel] = time;
    this.setState({ setClicked: true });

    return setDefaultTime(timeChange);
  };

  UNSAFE_componentWillReceiveProps(nextProps) {
    const nextState = this.getStateFromProps(nextProps);
    return this.setState(nextState);
  }

  hasValidInputs = () => {
    return this.isDateValid() && this.isTimeValid();
  };

  isDateValid = () => {
    return ((this.state != null ? this.state.date : undefined) != null) && isEmpty(__guard__(__guard__(this.refs != null ? this.refs.date : undefined, x1 => x1.state), x => x.errors));
  };

  isJustSet = (prevProps, prevState) => {
    return prevState.isSetting &&
      !this.state.isSetting &&
      !prevState.isTimeDefault &&
      this.state.isTimeDefault;
  };

  isTimeDefault = (time, props) => {
    if (time == null) { time = this.state != null ? this.state.time : undefined; }
    if (isUndefined(time)) { return true; }

    if (props == null) { (((((((({ props } = this)))))))); }
    const { defaultTime } = props;
    return time === defaultTime;
  };

  isTimeValid = (time) => {
    if (time == null) { time = this.state != null ? this.state.time : undefined; }

    return (time != null) && isEmpty(__guard__(__guard__(__guard__(__guard__(this.refs != null ? this.refs.time : undefined, x3 => x3.refs), x2 => x2.timeInput), x1 => x1.state), x => x.errors));
  };

  render() {
    let setAsDefaultOption;
    const { label, taskingIdentifier } = this.props;
    const { isSetting, isTimeValid, justSet, setClicked, isTimeDefault } = this.state;

    const type = label.toLowerCase();

    const timeProps = omit(this.props, 'value', 'onChange', 'label');
    const dateProps = omit(this.props, 'defaultValue', 'onChange', 'label');

    timeProps.label = `${label} Time`;
    dateProps.label = `${label} Date`;

    if (!isTimeDefault && isTimeValid) {
      const setAsDefaultExplanation = <Popover id={`tasking-datetime-default-tip-${label}-${taskingIdentifier}`}>
        {label}
        {' times for assignments created from now on will have this time set as the default.\
  '}
      </Popover>;

      setAsDefaultOption = <AsyncButton
        className="tasking-time-default"
        bsStyle="link"
        waitingText="Saving…"
        isWaiting={isSetting && setClicked}
        onClick={this.setDefaultTime}>
        {'\
  Set as default\
  '}
        <OverlayTrigger placement="top" overlay={setAsDefaultExplanation}>
          <i className="fa fa-info-circle" />
        </OverlayTrigger>
      </AsyncButton>;
    } else if (justSet) {
      setAsDefaultOption = <span className="tasking-time-default tasking-time-default-set">
        {'\
  Default set.\
  '}
      </span>;
    }


    return (
      <Col xs={12} md={6}>
        <Row>
          <Col xs={8} md={7} className={`tasking-date -assignment-${type}-date`}>
            <TutorDateInput {...dateProps} onChange={this.onDateChange} ref="date" />
          </Col>
          <Col xs={4} md={5} className={`tasking-time -assignment-${type}-time`}>
            <TutorTimeInput
              {...timeProps}
              onChange={this.onTimeChange}
              onUpdated={this.onTimeUpdated}
              ref="time" />
            {setAsDefaultOption}
          </Col>
        </Row>
      </Col>
    );
  }
}

export default DateTime;

function __guard__(value, transform) {
  return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
}
