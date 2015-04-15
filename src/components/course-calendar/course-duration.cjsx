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
      fullDuration = moment(plan.opens_at).twix(plan.due_at)
      plan.duration = fullDuration.intersection(duration)

  isInDuration: (duration) ->
    (plan) ->
      plan.duration = plan.duration.intersection(duration)
      plan.duration.length('hours') > 0

  groupByRanges: (durationsInView) ->
    (range, nthRange) ->
      rangeData =
        nthRange: nthRange
        plans: []

      _.each(durationsInView, (plan) ->
          if plan.duration.overlaps(range)
            planForRange =
              rangeDuration: plan.duration.intersection(range)
              offset: moment(range.start).twix(plan.duration.start).length('days')
              duration: plan.duration
              plan: _.omit(plan, 'days', 'due_at', 'opens_at', 'duration', 'durationAsWeeks')

            rangeData.plans.push(planForRange)
      )

      rangeData

  renderGroupedDurations: (range) ->
    @renderChildren(range)

  renderDurations: (durations, viewingDuration, groupingDurations)->
    durationsInView = _.chain(durations)
      .each(@setDuration(viewingDuration))
      .filter(@isInDuration(viewingDuration))
      .value()

    renderedDurations = _.chain(groupingDurations)
      .map(@groupByRanges(durationsInView))
      .map(@renderGroupedDurations)
      .value()

    renderedDurations

  render: ->
    {durations, viewingDuration, groupingDurations} = @props
    renderedDurations = @renderDurations(durations, viewingDuration, groupingDurations)

    <div ref='course-durations'>
      {renderedDurations}
    </div>


module.exports = CourseDuration
