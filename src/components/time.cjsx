moment = require 'moment'
{TimeStore} = require '../flux/time'
React = require 'react'

module.exports = React.createClass
  displayName: 'Time'
  propTypes:
    date: React.PropTypes.oneOfType([
      React.PropTypes.string
      React.PropTypes.instanceOf(Date)
    ]).isRequired
    format: React.PropTypes.string

  getDefaultProps: ->
    format: 'short'
    date: TimeStore.getNow()

  render: ->
    {format, date} = @props
    format = switch @props.format
      when 'shortest' then 'M/D'  # 9/14
      when 'short' then 'MMM DD, YYYY'  # Feb 14, 2010
      when 'long'  then 'dddd, MMMM Do YYYY, h:mm:ss a' # Sunday, February 14th 2010, 3:25:50 pm
      else @props.format

    <time>{moment(date).format(format)}</time>
