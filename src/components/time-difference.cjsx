moment = require 'moment'
{TimeStore} = require '../flux/time'
React = require 'react'

module.exports = React.createClass
  displayName: 'TimeDifference'
  propTypes:
    date: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.instanceOf(Date)
    ]).isRequired
    compareWith: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.instanceOf(Date)
    ])
    compare: React.PropTypes.oneOf(['from', 'to'])
    toleranceMS: React.PropTypes.number
    defaultText: React.PropTypes.string

  getDefaultProps: ->
    compareWith: TimeStore.getNow()
    compare: 'from'
    customSuffix: undefined
    toleranceMS: 60000
    defaultText: 'just now'

  shouldRenderDifference: ->
    {date, compareWith, toleranceMS} = @props
    Math.abs(moment(date).diff(compareWith)) > toleranceMS

  render: ->
    {date, compareWith, compare, customSuffix, defaultText} = @props

    differenceText = defaultText
    if @shouldRenderDifference()
      differenceText = moment(date)[compare](compareWith, customSuffix?)
      differenceText += customSuffix if customSuffix?

    <span>{differenceText}</span>
