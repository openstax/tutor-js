import { React, observable, observer, action, cn } from 'vendor';
import PropTypes from 'prop-types';
import { Button } from 'react-bootstrap';
import Course from '../../models/course';
import { Icon } from 'shared';
import CalendarHelper from './helper';

const OPEN_ICON = 'close';
const CLOSED_ICON = 'bars';

export default
@observer
class CalendarSidebarToggle extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    onToggle: PropTypes.func.isRequired,
    defaultOpen: PropTypes.bool,
  };

  static defaultProps = { defaultOpen: false };

  @observable isOpen = CalendarHelper.isSidebarOpen(this.props.course);
  @observable iconType = this.isOpen ? OPEN_ICON : CLOSED_ICON;
  @observable pendingIntroTimeout;

  componentDidMount() {
    if (this.isOpen) {
      this.props.onToggle(this.isOpen);
    } else {
      this.pendingIntroTimeout = CalendarHelper.scheduleIntroEvent(this.onToggle);
    }
  }

  componentWillUnmount() {
    CalendarHelper.clearScheduledEvent(this.pendingIntroTimeout);
  }

  @action.bound setIconType() {
    this.iconType = this.isOpen ? OPEN_ICON : CLOSED_ICON;
  }

  @action.bound onToggle() {
    const isOpen = !this.isOpen;
    CalendarHelper.setSidebarOpen(this.props.course, isOpen);
    CalendarHelper.clearScheduledEvent(this.pendingIntroTimeout);
    this.isOpen = isOpen;
    this.pendingIntroTimeout = false;
    this.props.onToggle(isOpen);
  }

  render() {
    return (
      <Button
        variant="default"
        onTransitionEnd={this.setIconType}
        onClick={this.onToggle}
        className={cn('sidebar-toggle', { open: this.isOpen })}
      >
        <span className="text">Add Assignment</span>
        <Icon type={this.iconType} />
      </Button>
    );
  }
}
