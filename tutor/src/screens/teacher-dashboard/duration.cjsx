React = require 'react'
moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
camelCase = require 'lodash/camelCase'
padStart = require 'lodash/padStart'

{ observer } = require 'mobx-react'
CoursePlan = require './plan'

{ default: PlanPublish } = require '../../models/jobs/task-plan-publish'
TimeHelper = require '../../helpers/time'
{TimeStore} = require '../../flux/time'
{isNew} = require '../../flux/helpers'

CourseDuration = React.createClass
  displayName: 'CourseDuration'

  propTypes:
    durations: React.PropTypes.array.isRequired
    course: React.PropTypes.object.isRequired
    viewingDuration: React.PropTypes.instanceOf(twix).isRequired
    groupingDurations: React.PropTypes.arrayOf(React.PropTypes.instanceOf(twix)).isRequired
    referenceDate: TimeHelper.PropTypes.moment
    children: React.PropTypes.element

  getInitialState: ->
    ranges: []
    durationsByStartDate: []

  updateGroupedDurations: (props) ->
    {durations, viewingDuration, groupingDurations} = props

    groupedDurations = @groupDurations(durations, viewingDuration, groupingDurations)

    durationsByStartDate = _.chain(groupedDurations)
      .pluck('plansInRange')
      .flatten()
      .groupBy((rangedPlan) ->
        rangedPlan.plan.id
      )
      .map((groupedPlans) ->
        # Grab the first plan as representative plan for displays grouped by plan
        {plan} = _.first(groupedPlans)

        # omit the plan on the individual displays since they share one common plan
        # TODO: clean up so that plan doesn't get duplicated in the first place.
        displays = _.map(groupedPlans, (groupedPlan) ->
          _.omit(groupedPlan, 'plan')
        )

        {plan, displays}
      )
      .value()

    @setState({ranges: groupedDurations, durationsByStartDate})

  componentWillMount: ->
    @updateGroupedDurations(@props)

  componentWillReceiveProps: (nextProps) ->
    @updateGroupedDurations(nextProps)

  groupDurations: (durations, viewingDuration, groupingDurations) ->
    durationsInView = _.chain(durations)
      .clone()
      # TODO these parts actually seem like they should be in flux
      .filter(@isInDuration(viewingDuration))
      .sortBy((plan) =>
        expectedLength = 13
        # Sort by the following conditions, in decreasing priority.
        # A sorter here should be unix timestamp in ms.
        # See http://momentjs.com/docs/#/displaying/unix-timestamp-milliseconds/.
        sorters = [
          plan.duration.start().valueOf()
          plan.duration.end().valueOf()
          @_getEarliestOpensAt(plan).valueOf()
          moment(plan.last_published_at).valueOf()
        ]

        # Left pad the ms to ensure that pre 1X10^12 millseconds (~2001/09/08)
        # become 0_ _ _ _ _ _ _ _ _ _ _ _ where _ is some digit.
        # This ensures that all sorters, regardless of time until 1X10^13 millseconds,
        # will sort with their respective priorities, as each sorter will take up
        # the same amount of space in the resulting sortBy string.
        _.map(sorters, _.partial(padStart, _, expectedLength, '0')).join()
      )
      .value()

    groupedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .each(@calcDurationHeight)
      .tap(@calcTopOffset)
      .value()

  calcDurationHeight: (rangeData) ->
    rangeData.maxPlansOnDay = _.chain(rangeData.plansByDays)
      .map (plansByDay) =>
        @_setPlanRelativeOrder(plansByDay)
        # use plan relative order to calculate plan "height"
        _.map(plansByDay, (plan) -> -1 * plan.relativeOrder + 1)
      # flatten for all heights in week
      .flatten()
      # union with a 0 height, for durations with no plans
      .union([0])
      .max()
      .value()

    # set day height to the best-guess for this range based on how many plans it has.
    # It'll be fine-tuned later across all ranges
    rangeData.dayHeight = Math.max(
      @_calcDayHeight(rangeData.maxPlansOnDay), rangeData.dayHeight
    )

  calcTopOffset: (ranges) ->
    dayHeights = _.pluck(ranges, 'dayHeight')

    _.each(ranges, (range, index) ->
      weekTopOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) ->
        memo + current
      ).value()

      {maxPlansOnDay, plansByDays} = range
      _.each(plansByDays, (plans) ->
        _.each(plans, (duration) ->
          duration.weekTopOffset = weekTopOffset
          duration.order = maxPlansOnDay + duration.relativeOrder
        )
      )
    )

  _setPlanRelativeOrder: (plans) ->
    current =
      adder: 0

    # grab all existing orders in the day
    existingOrdered = _.chain(plans).pluck('relativeOrder').compact().value()

    _.each(plans, @_setPlanOrder({current, existingOrdered}))

  # set plan order, makes sure that order is not already taken on this day
  _setPlanOrder: ({current, existingOrdered}) ->
    (duration, order) =>
      duration.relativeOrder ?= @_calcOrder({existingOrdered, current, order})

  _calcOrder: ({existingOrdered, current, order}) ->
    # find an order that is not already occupied by any overlapping plans
    while existingOrdered.indexOf(-(order + current.adder)) > -1
      current.adder = current.adder + 1

    -(order + current.adder)

  _getDay: (oneMoment) ->
    moment(oneMoment).startOf('day').twix(moment(oneMoment).endOf('day'), {allDay: true})

  _getDurationFromMoments: (listOfMoments) ->
    _.reduce listOfMoments, (current, next) =>
      nextDay = @_getDay(next)

      current.union(nextDay)
    , @_getDay(listOfMoments[0])

  _getEarliestOpensAt: (plan) ->
    openDates = _.pluck(plan.tasking_plans, 'opens_at')
    rangeDates = _.union(openDates)
    openRange = @_getDurationFromMoments(rangeDates)
    openRange.start()

  isPlanPublishing: (plan) ->
    PlanPublish.isPublishing(plan)

  isInDuration: (duration) ->
    (plan) ->
      plan.duration.length('hours') > 0

  _calcDayHeight: (plans) ->
    plans * 3.6 + 1

  groupByRanges: (durationsInView) ->
    counter = {}
    (range, nthRange) =>
      rangeData =
        nthRange: nthRange
        dayHeight: 10
        maxPlansOnDay: 0
        plansByDays: []
        plansInRange: []

      _.each(durationsInView, (plan) =>
        if plan.duration.overlaps(range)
          counter[plan.id] ?= 0


          planForRange =
            rangeDuration: plan.duration.intersection(range)
            offset: range.start().twix(plan.duration.start()).length('days')
            plan: plan
            index: counter[plan.id]

          planForRange.offsetFromPlanStart = planForRange.rangeDuration.start().diff(plan.duration.start(), 'days')

          # Add plan to plans in range
          rangeData.plansInRange.push(planForRange)
          counter[plan.id] = counter[plan.id] + 1
      )

      # group plans in range by day
      dayIter = range.iterateInner('days')
      while dayIter.hasNext()
        dayOfWeek = dayIter.next()
        dayPlans =
          dayOfWeek: dayOfWeek.day()
          planSlots: {}
        dayDuration = dayOfWeek.twix(dayOfWeek.endOf('day'))
        plansOnDay = _.filter(rangeData.plansInRange, (plan) ->
          plan.rangeDuration.engulfs(dayDuration)
        )
        rangeData.plansByDays.push(plansOnDay)

      rangeData


  renderChildren: (item) ->
    {course} = @props
    React.Children.map(@props.children, (child) ->
      React.cloneElement(child, {item, course})
    )

  renderDurations: ->
    renderedDurations = _.map(@state.durationsByStartDate, @renderChildren)

  render: ->
    renderedDurations = @renderDurations()

    <div>
      {renderedDurations}
    </div>


module.exports = observer(CourseDuration)
