$ = require 'jquery'
React = require 'react'

api = require '../api'
{Exercise} = require './exercise'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


Reading = React.createClass
  render: ->
    content_html = @props.model.content_html or @state?.content_html
    if content_html
      <div className='arbitrary-html reading-step' dangerouslySetInnerHTML={{__html: content_html}} />

    else if @state?.content_html_error
      <div>Error loading Reading Step. Please reload the page and try again</div>

    else
      <div>Loading...</div>


Interactive = React.createClass
  render: ->
    <iframe src={@props.model.content_url} />


module.exports = {Reading, Interactive, Exercise}
