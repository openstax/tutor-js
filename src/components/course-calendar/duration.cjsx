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
    referenceDate: (props, propName, componentName) ->
      unless moment.isMoment(props[propName])
        new Error("#{propName} should be a moment for #{componentName}")
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
          plan.order = order + 1
          plan.weekTopOffset = weekTopOffset
        )
      )
    )

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

  # For displaying ranges for units in the future
  setDurationRange: (plan) ->
    plan.duration = @_getDurationRange(plan)

  setDurationDay: (plan) ->
    {referenceDate} = @props
    dueDates = _.pluck(plan.tasking_plans, 'due_at')

    plan.duration = @_getDurationFromMoments(dueDates)
    plan.openRange = @_getDurationRange(plan)
    plan.isOpen = plan.openRange.start.isBefore(referenceDate)
    # TODO replace logic when BE published_at is at dashboard route
    # plan.isPublished = (plan.published_at? and plan.published_at)
    plan.isPublished = (plan.published_at? and plan.published_at) or plan.isOpen
    plan.isTrouble = plan.is_trouble

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
