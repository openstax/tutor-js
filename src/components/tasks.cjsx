$ = require 'jquery'
React = require 'react'
AsyncState = require '../async-state'
Cache = require '../cache'

{Exercise} = require './exercise'

# React swallows thrown errors so log them first
err = (msgs...) ->
  console.error(msgs...)
  throw new Error(JSON.stringify(msgs...))


module.exports =
  ReadingTask: React.createClass
    mixins: [AsyncState]
    statics:
      getInitialAsyncState: (params, query, setState) ->
        promise = Cache.fetchTask(params.id)
        htmlPromise = promise.then (task) ->
          err('no content_url') unless task.content_url
          unless task.content_html
            return $.ajax(task.content_url, {dataType:'html'})
            .then (raw_html) ->
              task.content_html = raw_html
              raw_html
          return task.content_html

        {content_html: htmlPromise}

    # HACK to load images from http://archive.cnx.org
    # <img src> tags are parsed **immediately** when the DOM node is created.
    # Since the HTML contains references to `/resources/...` make sure the browser
    # fetches the images from archive.cnx.org.
    #
    # But, as soon as the images are fetched, change the base back to tutor
    # so all links do not point to archive.
    _changeBase: ->
      if $('base')[0]
        $('base').attr('href', 'http://archive.cnx.org')
      else
        $('body').append('<base href="http://archive.cnx.org" />')

    _resetBase: ->
      $('base').attr('href', '')

    componentWillMount:  -> @_changeBase()
    componentWillUpdate: -> @_changeBase()
    componentDidMount:  -> @_resetBase()
    componentDidUpdate: -> @_resetBase()


    render: ->
      content_html = @props.task.content_html or @state?.content_html
      if content_html

        <div className='panel panel-default'>
          <div className='panel-heading'>
            Reading Asignment

            <span className='pull-right'>
              <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.task.content_url}>Open in new Tab</a>
            </span>
          </div>
          <div className='panel-body' dangerouslySetInnerHTML={{__html: content_html}} />
        </div>

      else if @state?.content_html_error
        <div>Error loading Reading task. Please reload the page and try again</div>

      else

        <div>Loading...</div>


  ExerciseTask: React.createClass

   render: ->
     <Exercise config={@props.task.config} />


  InteractiveTask: React.createClass

    render: ->
      <div className='panel panel-default ui-interactive'>
        <div className='panel-heading'>
          Interactive

          <span className='pull-right'>
            <a className='ui-action btn btn-primary btn-sm' target='_window' href={@props.task.content_url}>Open in new Tab</a>
          </span>
        </div>
        <div className='panel-body'>
          <iframe src={@props.task.content_url} />
        </div>
      </div>
