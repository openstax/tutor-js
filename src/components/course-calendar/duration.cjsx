moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'
camelCase = require 'camelcase'

React = require 'react/addons'
CoursePlan = require './plan'

CourseDuration = React.createClass
  displayName: 'CourseDuration'

  propTypes:
    durations: React.PropTypes.array.isRequired
    viewingDuration: React.PropTypes.instanceOf(twix).isRequired
    groupingDurations: React.PropTypes.arrayOf(React.PropTypes.instanceOf(twix)).isRequired
    children: React.PropTypes.element

  getInitialState: ->
    groupedDurations: []
    durationsByStartDate: []

  componentWillReceiveProps: (nextProps) ->
    {durations, viewingDuration, groupingDurations} = nextProps

    groupedDurations = @groupDurations(durations, viewingDuration, groupingDurations)

    durationsByStartDate = _.chain(groupedDurations)
      .pluck('plans')
      .flatten()
      .value()

    console.log(durationsByStartDate)
    @setState({groupedDurations, durationsByStartDate})

  groupDurations: (durations, viewingDuration, groupingDurations) ->
    durationsInView = _.chain(durations)
      .clone()
      # TODO these parts actually seem like they should be in flux
      .each(@setDuration(viewingDuration))
      .filter(@isInDuration(viewingDuration))
      .sortBy('opens_at')
      .value()

    groupedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .each(@calcDayHeight)
      .tap(@calcTopOffset)
      .value()

  _calcDayHeight: (plans) ->
    plans * 3.6 + 1

  calcDayHeight:  (range) ->

    @_rankPlansWithinDuration(range)
    dayHeight = 10

    _.each(range.plansByOverlaps, (plans) =>
      if plans?.length > 2
        calcedHeight = @_calcDayHeight(plans.length)
        if calcedHeight > dayHeight
          dayHeight = calcedHeight

      _.each(plans, (plan) ->
        plan.order = plans.length - plan.rank
      )
    )

    range.dayHeight = dayHeight

  calcTopOffset: (ranges) ->
    dayHeights = _.pluck(ranges, 'dayHeight')

    _.each(ranges, (range, index) ->
      topOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) ->
        memo + current
      ).value()

      _.each(range.plans, (plan) ->
        plan.topOffset = topOffset
      )
    )

  # For displaying ranges for units in the future
  setDurationRange: (plan) ->
    if plan.opens_at and plan.due_at
      plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).endOf('day').add(1, 'day'), {allDay: true})
    else if plan.opens_at
      plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.opens_at).endOf('day'), {allDay: true})
    else if plan.due_at
      plan.duration = moment(plan.due_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})

  setDurationDay: (plan) ->
    if plan.due_at
      plan.duration = moment(plan.due_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})
    else if plan.opens_at # HACK. some plans don't have a due_at
      plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.opens_at).endOf('day'), {allDay: true})
    else
      throw new Error('BUG! All Plans should have a due_at')

  # TODO see how to pull out plan specific logic to show that this
  # can be reused for units, for example
  setDuration: (duration) ->
    (plan) =>
      # pinned to 'day' display for now. can be 'range' for units in the future.
      plan.mode = 'day'
      durationMethod = camelCase("set-duration-#{plan.mode}")
      @[durationMethod](plan)

  isInDuration: (duration) ->
    (plan) ->
      plan.duration.length('hours') > 0

  _rankPlansWithinDuration: (range) ->
    overlapCount = 0
    overlapLists = [[]]
    _.each range.plans, (plan, thisPlanIndex) ->
      planToCompareTo = range.plans[thisPlanIndex + 1]

      overlapLists[overlapLists.length - 1].push(plan)
      plan.rank = overlapCount

      return unless planToCompareTo?

      if plan.rangeDuration.overlaps(planToCompareTo.rangeDuration)
        overlapCount = overlapCount + 1
      else
        overlapCount = 0
        overlapLists.push([])

    range.plansByOverlaps = overlapLists

  groupByRanges: (durationsInView) ->
    counter = {}
    (range, nthRange) ->
      rangeData =
        nthRange: nthRange
        plans: []

      _.each(durationsInView, (plan) ->
        if plan.duration.overlaps(range)
          counter[plan.id] ?= 0
          planForRange =
            rangeDuration: plan.duration.intersection(range)
            offset: moment(range.start).twix(plan.duration.start).length('days')
            duration: plan.duration
            plan: _.omit(plan, 'due_at', 'opens_at', 'duration', 'durationAsWeeks')
            index: counter[plan.id]

          rangeData.plans.push(planForRange)
          counter[plan.id] = counter[plan.id] + 1
      )

      rangeData

  renderChildren: (item) ->
    {courseId} = @props
    React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, {item, courseId})
    )

  renderDurations: ->
    renderedDurations = _.map(@state.durationsByStartDate, @renderChildren)

  render: ->
    {durations, viewingDuration, groupingDurations} = @props
    renderedDurations = @renderDurations()

    <div>
      {renderedDurations}
    </div>


module.exports = CourseDuration
