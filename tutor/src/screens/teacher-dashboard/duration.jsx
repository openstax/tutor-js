import { React, classnames, observable, observer, action } from '../../helpers/react';
import moment from 'moment';
import twix from 'twix';
import _ from 'underscore';
import {
  camelCase, padStart, pluck, flatten, groupBy, map, first,
  filter, clone, partial, sortBy, forEach, compact,
} from 'lodash';
import Course from '../../models/course';
import CoursePlan from './plan';

import PlanPublish from '../../models/jobs/task-plan-publish';
import TimeHelper from '../../helpers/time';
import { TimeStore } from '../../flux/time';
import { isNew } from '../../flux/helpers';

@observer
export default class CourseDuration extends React.Component {
  static displayName = 'CourseDuration';

  static propTypes = {
    durations: React.PropTypes.array.isRequired,
    course: React.PropTypes.instanceOf(Course).isRequired,
    viewingDuration: React.PropTypes.instanceOf(twix).isRequired,
    groupingDurations: React.PropTypes.arrayOf(React.PropTypes.instanceOf(twix)).isRequired,
    referenceDate: TimeHelper.PropTypes.moment,
    children: React.PropTypes.element,
  };

  @observable ranges = [];
  @observable durationsByStartDate = [];

  @action.bound updateGroupedDurations(props) {
    const { durations, viewingDuration, groupingDurations } = props;

    const groupedDurations = this.groupDurations(durations, viewingDuration, groupingDurations);

    this.durationsByStartDate = map(
      groupBy(
        flatten(map(groupedDurations, 'plansInRange')),
        rangedPlan => rangedPlan.plan.id
      ),
      (groupedPlans) => {
        // Grab the first plan as representative plan for displays grouped by plan
        const { plan } = first(groupedPlans);

        // omit the plan on the individual displays since they share one common plan
        // TODO: clean up so that plan doesn't get duplicated in the first place.
        const displays = map(groupedPlans, groupedPlan => _.omit(groupedPlan, 'plan'));
        return { plan, displays };
      });

    this.ranges = groupedDurations;
  }

  componentWillMount() {
    this.updateGroupedDurations(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.updateGroupedDurations(nextProps);
  }

  groupDurations = (durations, viewingDuration, groupingDurations) => {
    let groupedDurations;
    const durationsInView =
      sortBy(
        filter(
          clone(durations),
          this.isInDuration(viewingDuration),
        ),
        (plan) => {
          const expectedLength = 13;
          // Sort by the following conditions, in decreasing priority.
          // A sorter here should be unix timestamp in ms.
          // See http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/.
          const sorters = [
            plan.duration.start().valueOf(),
            plan.duration.end().valueOf(),
            this._getEarliestOpensAt(plan).valueOf(),
            moment(plan.last_published_at).valueOf()
          ];

          // Left pad the ms to ensure that pre 1X10^12 millseconds (~2001/09/08)
          // become 0_ _ _ _ _ _ _ _ _ _ _ _ where _ is some digit.
          // This ensures that all sorters, regardless of time until 1X10^13 millseconds,
          // will sort with their respective priorities, as each sorter will take up
          // the same amount of space in the resulting sortBy string.
          return (
            map(sorters, partial(padStart, _, expectedLength, '0')).join()
          );
        }
      );

    return groupedDurations = _.chain(groupingDurations)
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
        return (
          _.map(plansByDay, plan => (-1 * plan.relativeOrder) + 1)
        );
      }).flatten()
    // union with a 0 height, for durations with no plans
      .union([0])
      .max()
      .value();

    // set day height to the best-guess for this range based on how many plans it has.
    // It'll be fine-tuned later across all ranges
    return (
      rangeData.dayHeight = Math.max(
        this._calcDayHeight(rangeData.maxPlansOnDay), rangeData.dayHeight
      )
    );
  };

  calcTopOffset = (ranges) => {
    const dayHeights = map(ranges, 'dayHeight');
    _.each(ranges, (range, index) => {
      const weekTopOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) => memo + current).value()
      const {maxPlansOnDay, plansByDays} = range;

      _.each(plansByDays, plans =>
        _.each(plans, (duration) => {
          duration.weekTopOffset = weekTopOffset;
          duration.order = maxPlansOnDay + duration.relativeOrder;
        }),
      );
    })
  };

  _setPlanRelativeOrder = (plans) => {
    const current = {adder: 0};
    // grab all existing orders in the day
    const existingOrdered = compact(map(plans, 'relativeOrder'));
    _.each(plans, this._setPlanOrder({current, existingOrdered}))
  };

  // set plan order, makes sure that order is not already taken on this day
  _setPlanOrder = ({current, existingOrdered}) => {
    return (
      (duration, order) => {
        if (!duration.relativeOrder) {
          duration.relativeOrder = this._calcOrder({existingOrdered, current, order});
        }
      }
    );
  };

  _calcOrder = ({existingOrdered, current, order}) => {
    // find an order that is not already occupied by any overlapping plans
    while (existingOrdered.indexOf(-(order + current.adder)) > -1) {
      current.adder = current.adder + 1;
    }

    return (

          -(order + current.adder)

    );
  };

  _getDay = (oneMoment) => {
    return (
      moment(oneMoment).startOf('day').twix(moment(oneMoment).endOf('day'), {allDay: true})
    );
  };

  _getDurationFromMoments = (listOfMoments) => {
    return _.reduce(listOfMoments, (current, next) => {
      const nextDay = this._getDay(next);
      return current.union(nextDay);
    }, this._getDay(listOfMoments[0]));
  };

  _getEarliestOpensAt = (plan) => {
    const openDates = map(plan.tasking_plans, 'opens_at');
    const rangeDates = _.union(openDates);
    const openRange = this._getDurationFromMoments(rangeDates);
    return (
      openRange.start()
    );
  };

  isPlanPublishing = (plan) => {
    return (
      PlanPublish.isPublishing(plan)
    );
  };

  isInDuration = (duration) => {
    return (
      plan => plan.duration.length('hours') > 0
    );
  };

  _calcDayHeight = (plans) => {
    return (
      (plans * 3.6) + 1
    );
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
        // const dayPlans = {
        //   dayOfWeek: dayOfWeek.day(),
        //   planSlots: {}
        // };
        var dayDuration = dayOfWeek.twix(dayOfWeek.endOf('day'));
        const plansOnDay = _.filter(rangeData.plansInRange, plan => plan.rangeDuration.engulfs(dayDuration));
        rangeData.plansByDays.push(plansOnDay);
      }

      return rangeData;
    };
  };

  renderChildren = (item) => {
    const { course } = this.props;
    return (
      React.Children.map(this.props.children, child => React.cloneElement(child, { item, course }))
    );
  };

  render() {
    return (
      <div className="durations">
        {map(this.durationsByStartDate, this.renderChildren)}
      </div>
    );
  }
}
