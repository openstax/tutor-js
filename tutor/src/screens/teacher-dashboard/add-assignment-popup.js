import { React, observer, cn } from 'vendor';
import PropTypes from 'prop-types';
import { Dropdown } from 'react-bootstrap';
import { Course, Time } from '../../models';
import { withRouter } from 'react-router-dom';
import AddMenu from './add-menu';

const CustomMenu = React.forwardRef(
    ({ children, className, 'aria-labelledby': labeledBy }, ref) => {
        return (
            <div
                ref={ref}
                className={className}
                aria-labelledby={labeledBy}
            >
                {children}
            </div>
        );
    },
);

CustomMenu.propTypes = {
    'aria-labelledby': PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
};

@observer
@withRouter
export default class AddAssignmentPopUp extends React.Component {

    static propTypes = {
        course: PropTypes.instanceOf(Course).isRequired,
        x: PropTypes.number,
        y: PropTypes.number,
        date: PropTypes.object,
        history: PropTypes.object.isRequired,
    }

    addMenu = new AddMenu({ history: this.props.history });

    get dateType() {
        const { date } = this.props;
        const { start, end } = this.props.course.bounds;
        if (date.isBefore(start, 'day')) {
            return 'day before term starts';
        } else if (date.isAfter(end, 'day')) {
            return 'day after term ends';
        } else if (date.isBefore(Time.now, 'day')) {
            return 'past day';
        }
        return null;
    }

    render() {
        let dropdownContent;
        const { date, x, y } = this.props;

        if (!date) { return null; }

        // DYNAMIC_ADD_ON_CALENDAR_POSITIONING
        // Positions Add menu on date
        const style = {
            left: x,
            top: y,
            position: 'absolute',
        };

        const addDateType = this.dateType;
        const className = cn('course-add-dropdown', { 'no-add': addDateType });
        // only allow add if addDate is on or after reference date
        dropdownContent = addDateType ? (
            <li>
                <span className="no-add-text">Cannot assign to {addDateType}</span>
            </li>
        ) : this.addMenu.render(this.props);


        return (
            <Dropdown
                style={style}
                id="course-add-dropdown"
                className={className}
                show
            >
                <Dropdown.Menu as={CustomMenu}>
                    {dropdownContent}
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}
