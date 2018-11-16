import { React, ReactDOM, observable, observer, action, cn } from '../../helpers/react';
import moment from 'moment';
import { isEmpty, find, defer, get, invoke } from 'lodash';
import 'moment-timezone';
import PropTypes from 'prop-types';
import qs from 'qs';
import Month from './month';
import extend from 'lodash/extend';
import TourRegion from '../../components/tours/region';
import Course from '../../models/course';
import { TimeStore } from '../../flux/time';
import TimeHelper from '../../helpers/time';
import TutorRouter from '../../helpers/router';
import TaskPlanMiniEditor from '../../components/task-plan/mini-editor';
import PlanClonePlaceholder from './plan-clone-placeholder';
import AddAssignmentSidebar from './add-assignment-sidebar';
import MonthTitleNav from './month-title-nav';
import AddAssignment from './add';

export default
@observer
class TeacherDashboard extends React.Component {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    date:       TimeHelper.PropTypes.moment,
    termStart:  TimeHelper.PropTypes.moment,
    termEnd:    TimeHelper.PropTypes.moment,
    className:  PropTypes.string,
    hasPeriods: PropTypes.bool.isRequired,
    dateFormat: PropTypes.string.isRequired,
    course:     PropTypes.instanceOf(Course).isRequired,
    showingSideBar: PropTypes.bool.isRequired,
    params: PropTypes.object,
  };

  static childContextTypes = {
    date: TimeHelper.PropTypes.moment,
    dateFormatted: PropTypes.string,
  };

  static defaultProps = { date: moment(TimeStore.getNow()) };
  @observable activeAddDate;
  @observable hoveredDay;
  @observable cloningPlan;
  @observable editingPlanId;
  @observable cloningPlanId;
  @observable editingPosition;
  @observable showMiniEditor;

  getChildContext() {
    return {
      date: this.props.date,
      dateFormatted: this.props.date.format(this.props.dateFormat),
    };
  }

  setDateParams(date) {
    const { params } = this.props;
    params.date = date.format(this.props.dateFormat);
    this.context.router.history.push(TutorRouter.makePathname('calendarByDate', params));
  }

  @action.bound setDate(date) {
    if (!moment(date).isSame(this.props.date, 'month')) {
      this.setDateParams(date);
    }
  }

  getMonthMods = (calendarDuration) => {
    const date = moment(TimeStore.getNow());
    const { termStart, termEnd } = this.props;

    const mods = [
      {
        component: [ 'day' ],
        events: {
          onClick: this.handleDayClick,
          onDragEnter: this.onDragHover,
        },
      },
    ];

    const getClassNameForDate = (dateToModify) => {
      const className =
        dateToModify.isBefore(date, 'day') ?
          'past'
          : dateToModify.isAfter(date, 'day') ?
            'upcoming'
            :
            'current';

      const termClasses =
        (() => {
          if (dateToModify.isBefore(termStart, 'day')) {
            return (
              'before-term'
            );
          } else if (dateToModify.isAfter(termEnd, 'day')) {
            return (
              'after-term'
            );
          }
        })();

      return cn(className, termClasses,
        { hovered: this.hoveredDay && dateToModify.isSame(this.hoveredDay, 'day') }
      );
    };

    const hackMoment = function(dateToModify, calendarDate) {
      // hacking moment instance to bypass naive filter
      // https://github.com/freiksenet/react-calendar/blob/master/src/Month.js#L64-L65
      // TODO make a pr to include mods for month edges in react-calendar
      // Otherwise, outside of month days do not get the mods.
      const hackedDate = dateToModify.clone();
      const { isSame } = hackedDate;
      hackedDate.isSame = function(dateToCompare, period) {
        if (dateToCompare.isSame(calendarDate, 'day') && (period === 'month')) {
          return (
            true
          );
        } else {
          return (
            isSame.call(hackedDate, dateToCompare, period)
          );
        }
      };
      return (
        hackedDate
      );
    };

    const makeModForDate = (
      dateToModify,
      calendarDate,
    ) => ({
      date: hackMoment(dateToModify, calendarDate),
      component: [ 'day' ],
      classNames: [ getClassNameForDate(dateToModify) ],
    })
    ;

    const daysOfDuration = calendarDuration.iterate('days');

    while (daysOfDuration.hasNext()) {
      // mods.push(makeModForDate(daysOfDuration.next(), this.props.date, this.state));
      mods.push(makeModForDate(daysOfDuration.next(), this.props.date));
    }

    return mods;
  };

  componentDidUpdate() {
    if (this.refs.courseDurations != null) {
      this.setDayHeight(this.refs.courseDurations.ranges);
    }
  }

  componentWillMount() {
    document.addEventListener('click', this.shouldHideAddOnDay, true);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.shouldHideAddOnDay, true);
  }

  @action.bound shouldHideAddOnDay(clickEvent) {
    if (isEmpty(this.activeAddDate)) { return; }

    if (!clickEvent.target.classList.contains('rc-Day') &&
      !get(clickEvent.target, 'parentNode.dataset.assignmentType')) {

      this.hideAddOnDay();
      clickEvent.preventDefault();
      clickEvent.stopImmediatePropagation();
    }
  }

  setDayHeight = (ranges) => {
    const calendar =  ReactDOM.findDOMNode(this);
    const nodesWithHeights = calendar.querySelectorAll('.rc-Week');

    // Adjust calendar height for each week to accomodate the number of plans shown on this week
    // CALENDAR_DAY_DYNAMIC_HEIGHT, see less for property that is overwritten.
    Array.prototype.forEach.call(nodesWithHeights, function(node, nthRange) {
      const range = find(ranges, { nthRange });
      node.style.height = range.dayHeight + 'rem';
    });
  };


  handleDayClick = (dayMoment, mouseEvent) => {
    this.refs.addOnDay.updateState(dayMoment, mouseEvent.pageX, mouseEvent.pageY);
    this.activeAddDate = dayMoment;
  };

  checkAddOnDay = (componentName, dayMoment, mouseEvent) => {
    if (mouseEvent.relatedTarget !== ReactDOM.findDOMNode(this.refs.addOnDay)) {
      this.hideAddOnDay(componentName, dayMoment, mouseEvent);
    }
  };

  undoActives = (componentName, dayMoment, mouseEvent) => {
    if ((dayMoment == null) || !dayMoment.isSame(this.refs.addOnDay.state.addDate, 'day')) {
      this.hideAddOnDay(componentName, dayMoment, mouseEvent)
    }
  };

  hideAddOnDay = (componentName) => {
    this.refs.addOnDay.close();
    this.activeAddDate = null;
  };

  getFullMonthName = () => {
    return invoke(this.props.date, 'format', 'MMMM');
  };

  @action.bound onDrop(item, offset) {
    const { termStart, termEnd } = this.props;
    if (!this.hoveredDay ||
      !this.hoveredDay.isBetween(termStart, termEnd, 'day', '[]') ||
      !this.hoveredDay.isSameOrAfter(TimeStore.getNow(), 'day')) { return; }
    if (item.pathname) { // is a link to create an assignment
      const url = item.pathname + '?' + qs.stringify({
        due_at: this.hoveredDay.format(this.props.dateFormat),
      });
      this.context.router.history.push(url);
    } else { // is a task plan to clone
      this.cloningPlan = extend(
        {},
        item,
        {
          due_at: this.hoveredDay,
          position: offset,
        },
      );
    }
  }

  onCloneLoaded = (newPlanId) => {
    defer(() => { // give flux store time to update
      return extend(
        this,
        {
          editingPlanId: newPlanId,
          cloningPlanId: this.cloningPlan.id,
          editingPosition: this.cloningPlan.position,
          cloningPlan: undefined,
        },
      );
    });
  };

  getEditingPlanEl = () => {
    if (!this.editingPlanId) { return null; }
    return ReactDOM.findDOMNode(this).querySelector(`.course-plan-${this.editingPlanId}`);
  };

  onDragHover = (day) => {
    this.hoveredDay = TimeHelper.getMomentPreserveDate(day);
  };

  onEditorHide = () => {
    this.editingPlanId = null;
    this.cloningPlanId = null;
  };

  onIfIsEditing = (plan) => {
    if ((plan.id === this.editingPlanId) ||
      (plan.cloned_from_id === (this.cloningPlan != null ? this.cloningPlan.id : undefined))) {
      this.showMiniEditor = true;
    }
  };

  offIfIsEditing = (plan) => {
    if (plan.id === this.editingPlanId) {
      this.showMiniEditor = false;
    }
  }

  render() {
    const { course, className, date, hasPeriods, termStart, termEnd } = this.props;

    const calendarClassName = cn('calendar-container', className,
      { 'with-sidebar-open': this.props.showingSideBar }
    );

    return (
      <TourRegion
        className={calendarClassName}
        id="teacher-calendar"
        otherTours={[
          'teacher-calendar-super', 'reading-published', 'homework-published', 'new-enrollment-link',
        ]}
        courseId={course.id}>
        <AddAssignment
          ref="addOnDay"
          hasPeriods={hasPeriods}
          course={course}
          termStart={termStart}
          termEnd={termEnd}
        />
        <div className="calendar-body">
          <AddAssignmentSidebar
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
            <Month course={course} date={date} />
          </div>
        </div>

        {this.cloningPlan && (
          <PlanClonePlaceholder
            planId={this.cloningPlan.id}
            planType={this.cloningPlan.type}
            position={this.cloningPlan.position}
            course={this.props.course}
            due_at={this.cloningPlan.due_at}
            onLoad={this.onCloneLoaded}
          />)}
        {this.editingPlanId && this.showMiniEditor && (
          <TaskPlanMiniEditor
            planId={this.editingPlanId}
            position={this.editingPosition}
            courseId={course.id}
            termStart={termStart}
            termEnd={termEnd}
            onHide={this.onEditorHide}
            findPopOverTarget={this.getEditingPlanEl}
          />)}
      </TourRegion>
    );
  }

};
