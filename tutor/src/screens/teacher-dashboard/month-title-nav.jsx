import { React, PropTypes, observer, action  } from 'vendor';
import { Icon } from 'shared';
import TimeHelper from '../../helpers/time';

@observer
class CourseCalendarTitleNav extends React.Component {
    static displayName = 'CourseCalendarTitleNav';

    static propTypes = {
        setDate: PropTypes.func.isRequired,
        date: TimeHelper.PropTypes.moment,
        format: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
    };

    static defaultProps = {
        duration: 'month',
        format: 'MMMM YYYY',
    };

    handleNavigate = (subtractOrAdd, clickEvent) => {
        const { duration } = this.props;
        const date = this.props.date.clone()[subtractOrAdd](1, duration);
        clickEvent.preventDefault();
        this.props.setDate(date);
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
                    {this.props.date.format(this.props.format)}
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
