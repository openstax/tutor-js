moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
camelCase = require 'camelcase'

React = require 'react/addons'
CoursePlan = require './plan'
PlanHelper = require '../../helpers/plan'
{TimeStore} = require '../../flux/time'

CourseDuration = React.createClass
  displayName: 'CourseDuration'

  propTypes:
    durations: React.PropTypes.array.isRequired
    courseId: React.PropTypes.string.isRequired
    viewingDuration: React.PropTypes.instanceOf(twix).isRequired
    groupingDurations: React.PropTypes.arrayOf(React.PropTypes.instanceOf(twix)).isRequired
    referenceDate: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")
    children: React.PropTypes.element
    recentTolerance: React.PropTypes.number

  getInitialState: ->
    ranges: []
    durationsByStartDate: []

  getDefaultProps: ->
    # check publishings from within the last hour by default
    recentTolerance: 3600000

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
      .each(@setDuration(viewingDuration))
      .filter(@isInDuration(viewingDuration))
      .sortBy((plan) ->
        moment(plan.published_at).valueOf()
      )
      .sortBy((plan) ->
        plan.duration.end.valueOf()
      )
      .sortBy((plan) ->
        plan.duration.start.valueOf()
      )
      .value()

    groupedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .tap(@calcTopOffset)
      .value()

  calcTopOffset: (ranges) ->
    dayHeights = _.pluck(ranges, 'dayHeight')

    _.each(ranges, (range, index) =>
      weekTopOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) ->
        memo + current
      ).value()

      {maxPlansOnDay, plansByDays} = range
      _.each(plansByDays, (plans) =>
        current =
          adder: 0

        # grab all existing orders in the day
        existingOrdered = _.chain(plans)
          .pluck('order')
          .compact()
          .value()

        _.chain(plans)
          .sortBy((plan) ->
            -1 * plan.rangeDuration.start.valueOf()
          )
          .each(@setPlanOrder({current, existingOrdered, weekTopOffset, maxPlansOnDay}))
          .value()
      )
    )

  # set plan order, makes sure that order is not already taken on this day
  setPlanOrder: ({current, existingOrdered, weekTopOffset, maxPlansOnDay}) ->
    (plan, order) =>
      unless plan.order?
        current.order = order
        @_calcOrder({existingOrdered, current, maxPlansOnDay})
        plan.order = current.order
        plan.weekTopOffset = weekTopOffset

  _calcOrder: ({existingOrdered, current, maxPlansOnDay}) ->
    # find an order that is not already occupied by any overlapping plans
    while existingOrdered.indexOf(maxPlansOnDay - (current.order + current.adder)) > -1
      current.adder = current.adder + 1

    current.order = maxPlansOnDay - (current.order + current.adder)

  _getDay: (oneMoment) ->
    moment(oneMoment).startOf('day').twix(moment(oneMoment).endOf('day'), {allDay: true})

  _getDurationFromMoments: (listOfMoments) ->
    _.reduce listOfMoments, (current, next) =>
      nextDay = @_getDay(next)

      current.union(nextDay)
    , @_getDay(listOfMoments[0])


  _getDurationRange: (plan) ->
    openDates = _.pluck(plan.tasking_plans, 'opens_at')
    dueDates = _.pluck(plan.tasking_plans, 'due_at')

    rangeDates = _.union(openDates, dueDates)

    @_getDurationFromMoments(rangeDates)

  _getEarliestOpensAt: (plan) ->
    openDates = _.pluck(plan.tasking_plans, 'opens_at')
    rangeDates = _.union(openDates)
    openRange = @_getDurationFromMoments(rangeDates)
    openRange.start

  # For displaying ranges for units in the future
  setDurationRange: (plan) ->
    plan.duration = @_getDurationRange(plan)

  isPlanPublishing: (plan) ->
    PlanHelper.isPublishing(plan, @props.recentTolerance)

  setDurationDay: (plan) ->
    {referenceDate} = @props
    dueDates = _.pluck(plan.tasking_plans, 'due_at')

    plan.duration = @_getDurationFromMoments(dueDates)

  setPlanStatus: (plan) ->
    {referenceDate} = @props
    openRange = @_getDurationRange(plan)

    plan.isOpen = openRange.start.isBefore(referenceDate)
    plan.isPublished = (plan.published_at? and plan.published_at)
    plan.isPublishing = @isPlanPublishing(plan)
    plan.isTrouble = plan.is_trouble
    plan.isEditable = plan.duration.start.isAfter(referenceDate)

  # TODO see how to pull out plan specific logic to show that this
  # can be reused for units, for example
  setDuration: (duration) ->
    (plan) =>
      # pinned to 'day' display for now. can be 'range' for units in the future.
      plan.mode = 'day'
      durationMethod = camelCase("set-duration-#{plan.mode}")
      @[durationMethod](plan)

      @setPlanStatus(plan)

  isInDuration: (duration) ->
    (plan) ->
      plan.duration.length('hours') > 0

  _calcDayHeight: (plans) ->
    plans * 3.6 + 1

  _setDayHeightToMaxOverlaps: (currentOverlap, rangeData) ->
    # calculate day height based on the number of durations that overlap
    calcedHeight = @_calcDayHeight(currentOverlap.length)

    # if the day height is more than previously calculated day height,
    # update with the larger day height
    if calcedHeight > rangeData.dayHeight
      rangeData.dayHeight = calcedHeight

  _getSimplePlan: (plan) ->
    # Make a simple plan that omits duration/time related information
    # and adds back in only the relevant time information needed by the
    # CoursePlan component.
    simplePlan = _.omit(plan, 'duration', 'tasking_plans')
    earliestOpensAt = @_getEarliestOpensAt(plan)
    simplePlan.opensAt = moment(earliestOpensAt).format('M/D')
    simplePlan.durationLength = plan.duration.length('days')

    simplePlan

  groupByRanges: (durationsInView) ->
    counter = {}
    (range, nthRange) =>
      rangeData =
        nthRange: nthRange
        dayHeight: 10
        maxPlansOnDay: 0
        plansByDays: []
        plansInRange: []

      simplePlans = {}

      _.each(durationsInView, (plan) =>
        if plan.duration.overlaps(range)
          counter[plan.id] ?= 0
          simplePlans[plan.id] ?= @_getSimplePlan(plan)

          planForRange =
            rangeDuration: plan.duration.intersection(range)
            offset: moment(range.start).twix(plan.duration.start).length('days')
            plan: simplePlans[plan.id]
            index: counter[plan.id]

          planForRange.offsetFromPlanStart = planForRange.rangeDuration.start.diff(plan.duration.start, 'days')

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

      rangeData.maxPlansOnDay = _.max(rangeData.plansByDays, (plansOnDay) ->
        plansOnDay.length
      ).length

      # set day height to fit the number of overlapping durations
      dayHeight = @_calcDayHeight(rangeData.maxPlansOnDay)
      rangeData.dayHeight = dayHeight if dayHeight > rangeData.dayHeight
      rangeData

  renderChildren: (item) ->
    {courseId} = @props
    React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, {item, courseId})
    )

  renderDurations: ->
    renderedDurations = _.map(@state.durationsByStartDate, @renderChildren)

  render: ->
    renderedDurations = @renderDurations()

    <div>
      {renderedDurations}
    </div>


module.exports = CourseDuration
