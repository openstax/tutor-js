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

  renderChildren: (range) ->
    React.Children.map(@props.children, (child) ->
        React.addons.cloneWithProps(child, {
          range: range
        })
    )

  # TODO see how to pull out plan specific logic to show that this
  # can be reused for units, for example
  setDuration: (duration) ->
    (plan) ->
      plan.duration = moment(plan.opens_at).startOf('day').twix(moment(plan.due_at).add(1, 'day').endOf('day'), {allDay: true})

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

  renderDurations: (durations, viewingDuration, groupingDurations)->
    durationsInView = _.chain(durations)
      .clone()
      # TODO these parts actually seem like they should be in flux
      .each(@setDuration(viewingDuration))
      .filter(@isInDuration(viewingDuration))
      .sortBy('opens_at')
      .value()

    renderedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .map(@renderGroupedDurations)
      .value()

    renderedDurations

  render: ->
    {durations, viewingDuration, groupingDurations} = @props
    renderedDurations = @renderDurations(durations, viewingDuration, groupingDurations)

    <div>
      {renderedDurations}
    </div>


module.exports = CourseDuration
