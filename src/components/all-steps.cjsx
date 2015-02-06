$ = require 'jquery'
React = require 'react'

api = require '../api'
{Exercise} = require './exercise'
ArbitraryHtmlAndMath = require './html'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


Reading = React.createClass
  render: ->
    {content_html} = @props.model
    <ArbitraryHtmlAndMath html={content_html} />

Interactive = React.createClass
  render: ->
    <iframe src={@props.model.content_url} />

module.exports = {Reading, Interactive, Exercise}
