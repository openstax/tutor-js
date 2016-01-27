React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

BookLink = React.createClass
  displayName: 'BookLink'
  propTypes:
    children: React.PropTypes.node
    collectionUUID: React.PropTypes.string.isRequired
    moduleUUID: React.PropTypes.string.isRequired
    link: React.PropTypes.string

  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)

  broadcastNav: (clickEvent) ->
    clickEvent.preventDefault()

    {conClick} = @props
    {close, navigator} = @context

    close()
    navigator.emit('close.for.book', _.pick(@props, 'collectionUUID', 'moduleUUID', 'link'))

    onClick?(clickEvent)
    true

  render: ->
    {children, className} = @props
    linkProps = _.omit(@props, 'children', 'className', 'onClick')
    classes = classnames 'concept-coach-book-link', className

    <a {...linkProps} role='button' className={classes} onClick={@broadcastNav}>
      <i className='fa fa-book'></i>
      {children}
    </a>

ExerciseButton = React.createClass
  displayName: 'ExerciseButton'
  propTypes:
    children: React.PropTypes.node
  contextTypes:
    navigator: React.PropTypes.instanceOf(EventEmitter2)
  getDefaultProps: ->
    children: 'Exercise'
  showExercise: ->
    @context.navigator.emit('show.task', {view: 'task'})
    @props.onClick?()
  render: ->
    <BS.Button onClick={@showExercise}>{@props.children}</BS.Button>

ContinueToBookLink = React.createClass
  displayName: 'ContinueToBookLink'
  propTypes:
    children: React.PropTypes.node
    moduleUUID: React.PropTypes.string
    taskId: React.PropTypes.string
  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)
    collectionUUID: React.PropTypes.string
    getNextPage: React.PropTypes.func

  getInitialState: ->
    @getNextPage()

  componentWillReceiveProps: (nextProps, nextContext) ->
    nextPage = @getNextPage(nextProps, nextContext)
    @setState(nextPage)

  getNextPage: (props, context) ->
    props ?= @props
    context ?= @context

    {moduleUUID} = props
    {collectionUUID} = context
    context.getNextPage?({moduleUUID, collectionUUID}) or 'Reading'

  render: ->
    props = _.omit(@props, 'children')
    {label, moduleUUID} = @state
    {collectionUUID} = @context

    continueLabel = @props.children unless _.isEmpty @props.children
    continueLabel ?= "Continue to #{label}"

    <BookLink
      {...props}
      moduleUUID={moduleUUID}
      collectionUUID={collectionUUID}>
      {continueLabel}
    </BookLink>

module.exports = {ExerciseButton, ContinueToBookLink, BookLink}
