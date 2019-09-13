import PropTypes from 'prop-types';
import { React, observer, action  } from '../../helpers/react';
import moment from 'moment';
import { Icon } from 'shared';
import Time from '../../models/time';
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

  state = { date: this.props.date || moment(Time.now) };

  componentDidUpdate(prevProps) {
    if (!moment(prevProps.date).isSame(this.state.date, 'month')) {
      this.setState({ date: prevProps.date });
    }

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
            <Icon type="caret-left" />
          </a>
          {this.state.date.format(this.props.format)}
          <a
            href="#"
            className="calendar-header-control next"
            onClick={this.handleNext}>
            <Icon type="caret-right" />
          </a>
        </div>
      </div>
    );
  }
}

export default CourseCalendarTitleNav;
