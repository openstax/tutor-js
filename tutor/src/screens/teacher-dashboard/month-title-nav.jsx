import PropTypes from 'prop-types';
import { React, observer, action  } from '../../helpers/react';
import moment from 'moment';

import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';

@observer
class CourseCalendarTitleNav extends React.Component {
  static displayName = 'CourseCalendarTitleNav';

  static propTypes = {
    setDate: PropTypes.func,
    date: TimeHelper.PropTypes.moment,
    format: PropTypes.string.isRequired,
    duration: PropTypes.string.isRequired,
  };

  static defaultProps = {
    duration: 'month',
    format: 'MMMM YYYY',
  };

  state = { date: this.props.date || moment(TimeStore.getNow()) };

  componentWillReceiveProps(nextProps) {
    if (!moment(nextProps.date).isSame(this.state.date, 'month')) {
      this.setState({ date: nextProps.date });
    }
  }

  componentDidUpdate() {
    const { setDate } = this.props;
    return (
      (typeof setDate === 'function' ? setDate(this.state.date) : undefined)
    );
  }

  handleNavigate = (subtractOrAdd, clickEvent) => {
    const { duration } = this.props;
    const date = this.state.date.clone()[subtractOrAdd](1, duration);
    clickEvent.preventDefault();
    this.setState({ date });
  };

  @action.bound handleNext(clickEvent) {
    this.handleNavigate('add', clickEvent);
  }

  @action.bound handlePrevious(clickEvent) {
    this.handleNavigate('subtract', clickEvent);
  }

  render() {
    return (
      <div className="calendar-header-navigation">
        <div className="calendar-header-label">
          <a
            href="#"
            className="calendar-header-control previous"
            onClick={this.handlePrevious}>
            <i className="fa fa-caret-left" />
          </a>
          {this.state.date.format(this.props.format)}
          <a
            href="#"
            className="calendar-header-control next"
            onClick={this.handleNext}>
            <i className="fa fa-caret-right" />
          </a>
        </div>
      </div>
    );
  }
}

export default CourseCalendarTitleNav;
