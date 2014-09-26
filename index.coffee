# @cjsx React.DOM
Backbone = require 'backbone'
React    = require 'react'

$ = require 'jquery'
require 'bootstrap'


Hello = React.createClass
  render: ->
    <span className="hello">Hello World</span>

alert 'This works!'
