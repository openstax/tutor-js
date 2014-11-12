$ = require 'jquery'
React = require 'react'

api = require '../api'
{Exercise} = require './exercise'


# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


Reading = React.createClass
  # HACK to load images from http://archive.cnx.org
  # <img src> tags are parsed **immediately** when the DOM node is created.
  # Since the HTML contains references to `/resources/...` make sure the browser
  # fetches the images from archive.cnx.org.
  #
  # But, as soon as the images are fetched, change the base back to tutor
  # so all links do not point to archive.
  changeBase: ->
    if $('base')[0]
      $('base').attr('href', 'http://archive.cnx.org')
    else
      $('body').append('<base href="http://archive.cnx.org" />')

  resetBase: ->
    $('base').attr('href', '')

  componentWillMount:  ->
    @changeBase()
    # Fetch the content HTML and store it in the state
    unless @props.config.content_html # or @state?.content_html
      resolved = (content_html) => @setState({content_html})
      rejected =                => @setState({content_html_error:true})
      api.fetchRemoteHtml(@props.config.content_url)
      .then(resolved, rejected)

  componentWillUpdate: -> @changeBase()
  componentDidMount:  -> @resetBase()
  componentDidUpdate: -> @resetBase()


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
