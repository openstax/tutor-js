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
    ranges: []
    durationsByStartDate: []

  updateGroupedDurations: (props) ->
    {durations, viewingDuration, groupingDurations} = props

    groupedDurations = @groupDurations(durations, viewingDuration, groupingDurations)

    durationsByStartDate = _.chain(groupedDurations)
      .pluck('plansByOverlaps')
      .flatten()
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
      .sortBy('due_at')
      .value()

    groupedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .tap(@calcTopOffset)
      .value()

  calcTopOffset: (ranges) ->
    dayHeights = _.pluck(ranges, 'dayHeight')

    _.each(ranges, (range, index) ->
      weekTopOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) ->
        memo + current
      ).value()

      _.each(range.plansByOverlaps, (plans) ->
        _.each(plans, (plan, order) ->
          plan.order = plans.length - order
          plan.weekTopOffset = weekTopOffset
        )
      )
    )

  # For displaying ranges for units in the future
  setDurationRange: (plan) ->
    if plan.opens_at and plan.due_at
      plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})
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

  _calcDayHeight: (plans) ->
    plans * 3.6 + 1

  _setDayHeightToMaxOverlaps: (currentOverlap, rangeData) ->
    # calculate day height based on the number of durations that overlap
    calcedHeight = @_calcDayHeight(currentOverlap.length)

    # if the day height is more than previously calculated day height,
    # update with the larger day height
    if calcedHeight > rangeData.dayHeight
      rangeData.dayHeight = calcedHeight

  _checkAndSetOverlaps: (currentDur, durToCompareTo, plansByOverlaps) ->
    if durToCompareTo?
      # if the current duration does not overlap with the comparing duration,
      # make a new array of overlaps
      unless currentDur.rangeDuration.overlaps(durToCompareTo.rangeDuration)
        plansByOverlaps.push([])

    currentOverlap = _.last(plansByOverlaps)
    currentOverlap.push(currentDur)
    currentOverlap

  groupByRanges: (durationsInView) ->
    counter = {}
    (range, nthRange) =>
      rangeData =
        nthRange: nthRange
        dayHeight: 10
        plansByOverlaps: [[]]

      _.each(durationsInView, (plan) =>
        if plan.duration.overlaps(range)
          counter[plan.id] ?= 0

          planForRange =
            rangeDuration: plan.duration.intersection(range)
            offset: moment(range.start).twix(plan.duration.start).length('days')
            duration: plan.duration
            plan: _.omit(plan, 'due_at', 'opens_at', 'duration', 'durationAsWeeks')
            index: counter[plan.id]

          previousDur = _.last(_.last(rangeData.plansByOverlaps))

          # Check this duration for overlap with the previously sorted duration
          # Adds this duration the the previous group of durations if there is overlap.
          # Otherwise, add this duration to a new group.
          currentOverlap = @_checkAndSetOverlaps(planForRange, previousDur, rangeData.plansByOverlaps)

          # set day height to fit the number of overlapping durations
          @_setDayHeightToMaxOverlaps(currentOverlap, rangeData)

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
