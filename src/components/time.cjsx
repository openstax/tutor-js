moment = require 'moment'
React = require 'react'

module.exports = React.createClass
  render: ->
    time = moment(@props.date).format('LLL')
    <time>{time}</time>
