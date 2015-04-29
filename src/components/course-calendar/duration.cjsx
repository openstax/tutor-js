moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react/addons'

CourseDuration = React.createClass
  displayName: 'CourseDuration'

  propTypes:
    durations: React.PropTypes.array.isRequired
    viewingDuration: React.PropTypes.instanceOf(twix).isRequired
    groupingDurations: React.PropTypes.arrayOf(React.PropTypes.instanceOf(twix)).isRequired
    children: React.PropTypes.element

  getInitialState: ->
    groupedDurations: []

  componentWillReceiveProps: (nextProps) ->
    {durations, viewingDuration, groupingDurations} = nextProps

    groupedDurations = @groupDurations(durations, viewingDuration, groupingDurations)

    @setState({groupedDurations})

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
      .map(@calcDayHeight)
      .tap(@calcTopOffset)
      .value()

  _calcDayHeight: (plans) ->
    plans * 3 + 1

  calcDayHeight:  (range) ->
    dayHeight = 10

    if range?.plans?.length > 2
      dayHeight = @_calcDayHeight(range.plans.length)

    range.dayHeight = dayHeight
    range

  calcTopOffset: (ranges) ->
    dayHeights = _.pluck(ranges, 'dayHeight')

    _.each(ranges, (range, index) ->
      range.topOffset = _.chain(dayHeights).first(index + 1).reduce((memo, current) ->
        memo + current
      ).value()
    )

  renderChildren: (range) ->
    {courseId} = @props
    React.Children.map(@props.children, (child) ->
      React.addons.cloneWithProps(child, {range, courseId})
    )

  # TODO see how to pull out plan specific logic to show that this
  # can be reused for units, for example
  setDuration: (duration) ->
    (plan) ->
      # TODO: Commented_because_in_alpha_plans_in_the_calendar_do_not_have_ranges
      # if plan.opens_at and plan.due_at
      #   plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).endOf('day').add(1, 'day'), {allDay: true})
      # else if plan.opens_at
      #   plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.opens_at).endOf('day'), {allDay: true})
      # else if plan.due_at
      if plan.due_at
        plan.duration = moment(plan.due_at).startOf('day').twix(moment(plan.due_at).endOf('day'), {allDay: true})
      else if plan.opens_at # HACK. some plans don't have a due_at
        plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.opens_at).endOf('day'), {allDay: true})
      else
        throw new Error('BUG! All Plans should have a due_at')

  isInDuration: (duration) ->
    (plan) ->
      plan.duration.length('hours') > 0

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

  renderGroupedDurations: (range) ->
    @renderChildren(range)

  renderDurations: ->
    renderedDurations = _.map(@state.groupedDurations, @renderGroupedDurations)

  render: ->
    {durations, viewingDuration, groupingDurations} = @props
    renderedDurations = @renderDurations()

    <div>
      {renderedDurations}
    </div>


module.exports = CourseDuration
