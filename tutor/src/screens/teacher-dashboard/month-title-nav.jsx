import { React, PropTypes, observer, action, modelize } from 'vendor';
import { Icon } from 'shared';
import TimeHelper from '../../helpers/time';

@observer
class CourseCalendarTitleNav extends React.Component {
    static displayName = 'CourseCalendarTitleNav';

    static propTypes = {
        setDate: PropTypes.func.isRequired,
        date: TimeHelper.PropTypes.time,
        format: PropTypes.string.isRequired,
        duration: PropTypes.string.isRequired,
    };

    static defaultProps = {
        duration: 'month',
        format: 'MMMM YYYY',
    };

    handleNavigate = (subtractOrAdd, clickEvent) => {
        const { duration } = this.props;
        const date = this.props.date[subtractOrAdd]({ [`${duration}`]: 1 });
        clickEvent.preventDefault();
        this.props.setDate(date);
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound handleNext(clickEvent) {
        this.handleNavigate('plus', clickEvent);
    }

    @action.bound handlePrevious(clickEvent) {
        this.handleNavigate('minus', clickEvent);
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
