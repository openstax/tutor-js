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
    content_html = @props.config.content_html or @state?.content_html
    if content_html

      <div className='panel panel-default'>
        <div className='panel-heading'>
          Reading Asignment

          <span className='pull-right'>
            <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.config.content_url}>Open in new Tab</a>
          </span>
        </div>
        <div className='panel-body' dangerouslySetInnerHTML={{__html: content_html}} />
      </div>

    else if @state?.content_html_error
      <div>Error loading Reading task. Please reload the page and try again</div>

    else

      <div>Loading...</div>


Interactive = React.createClass
  render: ->
    <div className='panel panel-default ui-interactive'>
      <div className='panel-heading'>
        Interactive

        <span className='pull-right'>
          <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.config.content_url}>Open in new Tab</a>
        </span>
      </div>
      <div className='panel-body'>
        <iframe src={@props.config.content_url} />
      </div>
    </div>


getStepType = (stepConfig) ->
  switch stepConfig.type
    when 'reading' then Reading
    when 'interactive' then Interactive
    when 'exercise' then Exercise
    else err('BUG: Invalid task step type', stepConfig)

module.exports = {Reading, Interactive, Exercise, getStepType}
