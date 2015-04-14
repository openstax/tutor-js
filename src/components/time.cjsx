moment = require 'moment'
React = require 'react'

module.exports = React.createClass
  render: ->
    {format, date} = @props
    format ?= 'LLL'
    time = moment(date).format(format)
    <time>{time}</time>
