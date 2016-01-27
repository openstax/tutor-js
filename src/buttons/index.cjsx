React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

BookLink = React.createClass
  displayName: 'BookLink'
  propTypes:
    children: React.PropTypes.node
  render: ->
    {children, className} = @props
    linkProps = _.omit(@props, 'children', 'className')
    classes = classnames 'concept-coach-book-link', className

    <a {...linkProps} role='button' className={classes}>
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
  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)
    collectionUUID: React.PropTypes.string
    nextPage: React.PropTypes.string

  continueToBook: (clickEvent) ->
    clickEvent.preventDefault()
    {close, collectionUUID, navigator} = @context

    close()
    navigator.emit('close.for.continue', {collectionUUID})
    true

  render: ->
    props = _.omit(@props, 'children')
    {nextPage} = @context
    nextPage ?= 'Book'

    continueLabel = @props.children unless _.isEmpty @props.children
    continueLabel ?= "Continue to #{nextPage}"

    <BookLink {...props} onClick={@continueToBook}>{continueLabel}</BookLink>

module.exports = {ExerciseButton, ContinueToBookLink, BookLink}
