import { React, observable, observer } from '../../helpers/react';
import moment from 'moment';
import PropTypes from 'prop-types';
import twix from 'twix';
import _ from 'underscore';
import { padStart } from 'lodash';
import PlanPublish from '../../models/jobs/task-plan-publish';
import TimeHelper from '../../helpers/time';
import Course from '../../models/course';

export default
@observer
class CourseDuration extends React.Component {

  static propTypes = {
    durations: PropTypes.array.isRequired,
    course: PropTypes.instanceOf(Course).isRequired,
    viewingDuration: PropTypes.instanceOf(twix).isRequired,
    groupingDurations: PropTypes.arrayOf(PropTypes.instanceOf(twix)).isRequired,
    referenceDate: TimeHelper.PropTypes.moment,
    children: PropTypes.element,
  };

  @observable ranges = [];
  @observable durationsByStartDate = [];

  updateGroupedDurations = (props) => {
    const { durations, viewingDuration, groupingDurations } = props;

    const groupedDurations = this.groupDurations(durations, viewingDuration, groupingDurations);

    this.durationsByStartDate = _.chain(groupedDurations)
      .pluck('plansInRange')
      .flatten()
      .groupBy(rangedPlan => rangedPlan.plan.id)
      .map(function(groupedPlans) {
        // Grab the first plan as representative plan for displays grouped by plan
        const { plan } = _.first(groupedPlans);

        // omit the plan on the individual displays since they share one common plan
        // TODO: clean up so that plan doesn't get duplicated in the first place.
        const displays = _.map(groupedPlans, groupedPlan => _.omit(groupedPlan, 'plan'));

        return { plan, displays };
      })
      .value();
    this.ranges = groupedDurations;

  };

  componentWillMount() {
    this.updateGroupedDurations(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateGroupedDurations(nextProps);
  }

  groupDurations = (durations, viewingDuration, groupingDurations) => {

    const durationsInView = _.chain(durations)
      .clone()
      .filter(this.isInDuration(viewingDuration))
      .sortBy(plan => {
        const expectedLength = 13;
        // Sort by the following conditions, in decreasing priority.
        // A sorter here should be unix timestamp in ms.
        // See http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/.
        const sorters = [
          plan.duration.start().valueOf(),
          plan.duration.end().valueOf(),
          this._getEarliestOpensAt(plan).valueOf(),
          moment(plan.last_published_at).valueOf(),
        ];

        // Left pad the ms to ensure that pre 1X10^12 millseconds (~2001/09/08)
        // become 0_ _ _ _ _ _ _ _ _ _ _ _ where _ is some digit.
        // This ensures that all sorters, regardless of time until 1X10^13 millseconds,
        // will sort with their respective priorities, as each sorter will take up
        // the same amount of space in the resulting sortBy string.
        return _.map(sorters, _.partial(padStart, _, expectedLength, '0')).join();
      })
      .value();

    return _.chain(groupingDurations)
      .map(this.groupByRanges(durationsInView))
      .each(this.calcDurationHeight)
      .tap(this.calcTopOffset)
      .value();
  };

  calcDurationHeight = (rangeData) => {
    rangeData.maxPlansOnDay = _.chain(rangeData.plansByDays)
      .map(plansByDay => {
        this._setPlanRelativeOrder(plansByDay);
        // use plan relative order to calculate plan "height"
        return _.map(plansByDay, plan => (-1 * plan.relativeOrder) + 1);
      }).flatten()
      .union([0]) // union with a 0 height, for durations with no plans
      .max()
      .value();

    // set day height to the best-guess for this range based on how many plans it has.
    // It'll be fine-tuned later across all ranges
    return rangeData.dayHeight = Math.max(
      this._calcDayHeight(rangeData.maxPlansOnDay), rangeData.dayHeight
    );
  };

  calcTopOffset = (ranges) => {
    const dayHeights = _.pluck(ranges, 'dayHeight');

    _.each(ranges, function(range, index) {
      const weekTopOffset = _.chain(dayHeights)
        .first(index + 1)
        .reduce((memo, current) => memo + current)
        .value();

      const { maxPlansOnDay, plansByDays } = range;
      _.each(plansByDays, plans =>
        _.each(plans, function(duration) {
          duration.weekTopOffset = weekTopOffset;
          duration.order = maxPlansOnDay + duration.relativeOrder;
        })
      );
    });
  };

  _setPlanRelativeOrder = (plans) => {
    const current = { adder: 0 };

    // grab all existing orders in the day
    const existingOrdered = _.chain(plans).pluck('relativeOrder').compact().value();

    _.each(plans, this._setPlanOrder({ current, existingOrdered }));
  };

  // set plan order, makes sure that order is not already taken on this day
  _setPlanOrder = ({ current, existingOrdered }) => {
    return (duration, order) => {
      return duration.relativeOrder != null ? duration.relativeOrder : (duration.relativeOrder = this._calcOrder({ existingOrdered, current, order }));
    };
  };

  _calcOrder = ({ existingOrdered, current, order }) => {
    // find an order that is not already occupied by any overlapping plans
    while (existingOrdered.indexOf(-(order + current.adder)) > -1) {
      current.adder = current.adder + 1;
    }

    return -(order + current.adder);
  };

  _getDay = (oneMoment) => {
    return moment(oneMoment).startOf('day').twix(moment(oneMoment).endOf('day'), { allDay: true });
  };

  _getDurationFromMoments = (listOfMoments) => {
    return _.reduce(listOfMoments, (current, next) => {
      const nextDay = this._getDay(next);
      return current.union(nextDay);
    }, this._getDay(listOfMoments[0]));
  };

  _getEarliestOpensAt = (plan) => {
    const openDates = _.pluck(plan.tasking_plans, 'opens_at');
    const rangeDates = _.union(openDates);
    const openRange = this._getDurationFromMoments(rangeDates);
    return openRange.start();
  };

  isPlanPublishing = (plan) => {
    return PlanPublish.isPublishing(plan);
  };

  isInDuration = () => {
    return plan => plan.duration.length('hours') > 0;
  };

  _calcDayHeight = (plans) => {
    return (plans * 3.6) + 1;
  };

  groupByRanges = (durationsInView) => {
    const counter = {};
    return (range, nthRange) => {
      const rangeData = {
        nthRange,
        dayHeight: 10,
        maxPlansOnDay: 0,
        plansByDays: [],
        plansInRange: [],
      };

      _.each(durationsInView, plan => {
        if (plan.duration.overlaps(range)) {
          if (counter[plan.id] == null) { counter[plan.id] = 0; }


          const planForRange = {
            rangeDuration: plan.duration.intersection(range),
            offset: range.start().twix(plan.duration.start()).length('days'),
            plan,
            index: counter[plan.id],
          };

          planForRange.offsetFromPlanStart = planForRange.rangeDuration.start().diff(plan.duration.start(), 'days');

          // Add plan to plans in range
          rangeData.plansInRange.push(planForRange);
          counter[plan.id] = counter[plan.id] + 1;
        }
      });

      // group plans in range by day
      const dayIter = range.iterateInner('days');
      while (dayIter.hasNext()) {
        const dayOfWeek = dayIter.next();
        const dayDuration = dayOfWeek.twix(dayOfWeek.endOf('day'));
        const plansOnDay = _.filter(rangeData.plansInRange, plan => plan.rangeDuration.engulfs(dayDuration));
        rangeData.plansByDays.push(plansOnDay);
      }

      return rangeData;
    };
  };

  clonedChild = (item) => {
    const { course } = this.props;
    return React.Children.map(this.props.children, child => React.cloneElement(child, { item, course }));
  };

  render() {
    return (
      <div className="durations">
        {_.map(this.durationsByStartDate, this.clonedChild)}
      </div>
    );
  }
};
