# @cjsx React.DOM

React = require 'react'

Dashboard = React.createClass
  render: ->
    <a href="/about">About Us</a>

AboutUs = React.createClass
  render: ->
    <a href="/">Home</a>

module.exports = {Dashboard, AboutUs}
