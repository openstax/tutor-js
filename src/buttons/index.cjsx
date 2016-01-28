React = require 'react/addons'
BS = require 'react-bootstrap'
_ = require 'underscore'
EventEmitter2 = require 'eventemitter2'
classnames = require 'classnames'

BookLinkBase = React.createClass
  displayName: 'BookLinkBase'
  propTypes:
    children: React.PropTypes.node
    collectionUUID: React.PropTypes.string.isRequired
    moduleUUID: React.PropTypes.string
    link: React.PropTypes.string

  contextTypes:
    close: React.PropTypes.func
    navigator: React.PropTypes.instanceOf(EventEmitter2)

  broadcastNav: (clickEvent) ->
    clickEvent.preventDefault()

    {onClick} = @props
    {close, navigator} = @context

    close()
    navigator.emit('close.for.book', _.pick(@props, 'collectionUUID', 'moduleUUID', 'link'))

    onClick?(clickEvent)
    true

  render: ->
    {children} = @props
    return null unless children?

    React.addons.cloneWithProps(children, onClick: @broadcastNav)

BookLink = React.createClass
  displayName: 'BookLink'
  propTypes:
    children: React.PropTypes.node
  render: ->
    {children, className} = @props
    linkProps = _.omit(@props, 'children', 'className')
    classes = classnames 'concept-coach-book-link', className

    <BookLinkBase {...linkProps}>
      <a role='button' className={classes}>
        {children}
      </a>
    </BookLinkBase>

BookButton = React.createClass
  displayName: 'BookButton'
  propTypes:
    children: React.PropTypes.node
  render: ->
    {children, className} = @props
    linkProps = _.omit(@props, 'children', 'className')
    classes = classnames 'concept-coach-book-link', className

    <BookLinkBase {...linkProps}>
      <BS.Button className={classes} {...linkProps}>
        {children}
      </BS.Button>
    </BookLinkBase>

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

ContinueToBookButton = React.createClass
  displayName: 'ContinueToBookButton'
  propTypes:
    children: React.PropTypes.node
    moduleUUID: React.PropTypes.string
  contextTypes:
    collectionUUID: React.PropTypes.string
    getNextPage: React.PropTypes.func

  getInitialState: ->
    @getNextPage()
  getDefaultProps: ->
    bsStyle: 'primary'
  componentWillReceiveProps: (nextProps, nextContext) ->
    nextPage = @getNextPage(nextProps, nextContext)
    @setState(nextPage)

  getNextPage: (props, context) ->
    props ?= @props
    context ?= @context

    {moduleUUID} = props
    {collectionUUID} = context

    fallBack =
      nextChapter: 'Reading'
      nextModuleUUID: moduleUUID

    context.getNextPage?({moduleUUID, collectionUUID}) or fallBack

  render: ->
    props = _.omit(@props, 'children')
    {nextChapter, nextModuleUUID} = @state
    {collectionUUID} = @context

    continueLabel = @props.children unless _.isEmpty @props.children
    continueLabel ?= "Continue to #{nextChapter}"

    <BookButton
      {...props}
      moduleUUID={nextModuleUUID}
      collectionUUID={collectionUUID}>
      {continueLabel}
      <i className='fa fa-caret-right'></i>
    </BookButton>


GoToBookLink = React.createClass
  displayName: 'GoToBookLink'
  contextTypes:
    moduleUUID: React.PropTypes.string
    collectionUUID: React.PropTypes.string
    triggeredFrom:  React.PropTypes.shape(
      moduleUUID:     React.PropTypes.string
      collectionUUID: React.PropTypes.string
    )

  isFromOpen: ->
    {triggeredFrom} = @context
    viewingInfo = _.pick(@props, 'moduleUUID', 'collectionUUID')

    _.isEqual(triggeredFrom, viewingInfo)

  render: ->
    linkAction = if @isFromOpen() then 'Return' else 'Go'
    <BookLink {...@props}>
      {linkAction} to Reading
    </BookLink>


ReturnToBookButton = React.createClass
  displayName: 'ReturnToBookButton'
  getDefaultProps: ->
    section: 'Reading'
  render: ->
    {section, className} = @props
    classes = classnames 'btn-plain', className

    <BookButton {...@props} className={classes}>
      <i className='fa fa-caret-left'></i>
      Return to {section}
    </BookButton>

module.exports = {ExerciseButton, ContinueToBookButton, ReturnToBookButton, GoToBookLink, BookLink, BookLinkBase}
