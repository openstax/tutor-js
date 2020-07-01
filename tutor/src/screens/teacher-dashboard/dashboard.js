import { React, observable, observer, action, cn } from 'vendor';
import moment from 'moment';
import { get, invoke } from 'lodash';
import 'moment-timezone';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import qs from 'qs';
import Month from './month';
import TourRegion from '../../components/tours/region';
import Course from '../../models/course';
import Time from '../../models/time';
import TimeHelper from '../../helpers/time';
import TutorRouter from '../../helpers/router';
import AssignmentClone from '../assignment-edit/clone';
import Sidebar from './sidebar';
import MonthTitleNav from './month-title-nav';
import AddAssignmentPopup from './add-assignment-popup';

export default
@withRouter
@observer
class TeacherDashboard extends React.Component {

  static propTypes = {
    date:       TimeHelper.PropTypes.moment,
    className:  PropTypes.string,
    hasPeriods: PropTypes.bool.isRequired,
    dateFormat: PropTypes.string.isRequired,
    course:     PropTypes.instanceOf(Course).isRequired,
    showingSideBar: PropTypes.bool.isRequired,
    history: PropTypes.object.isRequired,
    params: PropTypes.object,
  };

  static defaultProps = {
    date: moment(Time.now),
    params: {},
  };

  @observable activeAddAssignment;
  @observable hoveredDay;
  @observable cloningPlan;
  @observable editingPlan;

  @action.bound setDate(date) {
    const { course, params } = this.props;
    if (moment(date).isSame(this.props.date, 'month')) {
      return;
    }
    const newParams = {
      ...params,
      courseId: course.id,
      date: date.format(this.props.dateFormat),
    };
    this.props.history.push(
      TutorRouter.makePathname('calendarByDate', newParams)
    );
  }

  componentDidMount() {
    document.addEventListener('click', this.shouldHideAddOnDay, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.shouldHideAddOnDay, true);
  }

  @action.bound shouldHideAddOnDay(clickEvent) {
    // hide unless a add option or day is clicked
    if (!clickEvent.target.classList.contains('.day') &&
      !get(clickEvent.target, 'dataset.assignmentType')) {
      this.activeAddAssignment = {};
    }
  }

  getFullMonthName = () => {
    return invoke(this.props.date, 'format', 'MMMM');
  };

  @action.bound onDrop(item) {
    const { course: { bounds: { start, end } } } = this.props;

    if (!this.hoveredDay ||
      !this.hoveredDay.isBetween(start, end, 'day', '[]') ||
      !this.hoveredDay.isSameOrAfter(Time.now, 'day')) { return; }
    if (item.pathname) { // is a link to create an assignment
      const url = item.pathname + '?' + qs.stringify({
        due_at: this.hoveredDay.format(this.props.dateFormat),
      });
      this.props.history.push(url);
    } else { // is a task plan to clone

      this.editingPlan = { ...item, date: this.hoveredDay };
    }
  }

  getEditingPlanEl = () => {
    if (!this.editingPlan) { return null; }
    const date = this.editingPlan.date.format('YYYYMMDD');
    return document.querySelector(`.day[data-date="${date}"]`);
  };

  onDragHover = (day) => {
    this.hoveredDay = day;
  };

  onEditorHide = () => {
    this.editingPlan = null;
  };

  @action.bound onDayClick(ev, date) {
    this.activeAddAssignment = {
      date, x: ev.pageX, y: ev.pageY,
    };
  }

  render() {
    const { course, className, date, hasPeriods, history } = this.props;

    const calendarClassName = cn('calendar-container', className,
      { 'with-sidebar-open': this.props.showingSideBar }
    );
  
    return (
      <TourRegion
        className={calendarClassName}
        id="teacher-calendar"
        otherTours={[
          'teacher-calendar-super', 'reading-published',
          'homework-published', 'new-enrollment-link',
        ]}
        courseId={course.id}>
        <AddAssignmentPopup
          hasPeriods={hasPeriods}
          course={course}
          {...this.activeAddAssignment}
        />
        <div className="calendar-body">
          <Sidebar
            isOpen={this.props.showingSideBar}
            course={this.props.course}
            hasPeriods={hasPeriods}
            cloningPlanId={
              this.cloningPlanId || (this.cloningPlan ? this.cloningPlan.id : undefined)
            }
          />
          <div className="month-body" data-duration-name={this.getFullMonthName()}>
            <MonthTitleNav
              course={this.props.course}
              duration="month"
              date={date}
              setDate={this.setDate}
            />
            <Month
              onDayClick={this.onDayClick}
              cloningPlan={this.cloningPlan}
              course={course}
              onDrag={this.onDragHover}
              onDrop={this.onDrop}
              date={date}
            />
          </div>
        </div>

        {this.editingPlan && (
          <AssignmentClone
            course={course}
            onHide={this.onEditorHide}
            sourcePlan={this.editingPlan}
            history={history}
          />)}
      </TourRegion>
    );
  }

}
