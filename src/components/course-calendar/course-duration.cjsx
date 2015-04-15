moment = require 'moment'
twix = require 'twix'
_ = require 'underscore'

React = require 'react/addons'
BS = require 'react-bootstrap'

CourseDuration = React.createClass
  displayName: 'CourseDuration'

  getInitialState: ->
    durationWidth: '100%'

  componentDidMount: ->
    @setState({
      durationWidth: @getDOMNode().clientWidth
    })

  componentDidUpdate: ->
    # React.findDOMNode(@refs.plans).style.width = @state.durationWidth

  renderChildren: (range) =>
    React.Children.map(@props.children, (child) ->
        React.addons.cloneWithProps(child, {
          range: range
        })
    )

  setPlanDuration: (duration) ->
    (plan) ->
      fullDuration = moment(plan.opens_at).twix(plan.due_at)
      plan.duration = fullDuration.intersection(duration)

  isPlanInDuration: (duration) ->
    (plan) ->
      plan.duration = plan.duration.intersection(duration)
      plan.duration.length('hours') > 0

  groupByRanges: (plansInMonth) ->
    (range, nthRange) ->
      rangeData =
        nthRange: nthRange
        plans: []

      _.each(plansInMonth, (plan) ->
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

  renderDurations: (viewingDuration, groupingDuration)->

    durationsInView = _.chain(@props.durations)
      .each(@setPlanDuration(viewingDuration))
      .filter(@isPlanInDuration(viewingDuration))
      .value()

    renderedDurations = _.chain(groupingDuration)
      .map(@groupByRanges(durationsInView))
      .map(@renderGroupedDurations)
      .value()

  render: ->
    {viewingDuration, groupingDuration} = @props

    @renderDurations(viewingDuration, groupingDuration)


module.exports = CourseDuration
