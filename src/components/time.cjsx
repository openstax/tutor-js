moment = require 'moment'
React = require 'react'

module.exports = React.createClass
  displayName: 'Time'
  propTypes:
    date: React.PropTypes.string.isRequired

  render: ->
    time = moment(@props.date).format('LLL')
    <time>{time}</time>
