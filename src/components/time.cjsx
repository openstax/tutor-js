moment = require 'moment'
React = require 'react'

module.exports = React.createClass
  displayName: 'Time'
  propTypes:
    date: React.PropTypes.string.isRequired

  render: ->
    {format, date} = @props
    format ?= 'LLL'
    time = moment(date).format(format)
    <time>{time}</time>
