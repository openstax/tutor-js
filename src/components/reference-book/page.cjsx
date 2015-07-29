React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
BookContentMixin = require '../book-content-mixin'
GetPositionMixin = require '../get-position-mixin'
{ReferenceBookExerciseShell} = require './exercise'

{ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

EXERCISE_MATCHER = new RegExp('\/exercises\/(.*)')

module.exports = React.createClass
  _exerciseNodes: []
  displayName: 'ReferenceBookPage'
  propTypes:
    courseId: React.PropTypes.string.isRequired
  contextTypes:
    router: React.PropTypes.func
  mixins: [BookContentMixin, GetPositionMixin]

  getCnxId: ->
    @props.cnxId or @context.router.getCurrentParams().cnxId

  getSplashTitle: ->
    cnxId = @getCnxId()
    page = ReferenceBookStore.getPageInfo({courseId: @props.courseId, cnxId})
    page?.title

  prevLink: (info) ->
    <Router.Link className='nav prev' to='viewReferenceBookPage'
      params={courseId: @props.courseId, cnxId: info.prev.cnx_id}>
      <div className='triangle' />
    </Router.Link>

  nextLink: (info) ->
    <Router.Link className='nav next' to='viewReferenceBookPage'
      params={courseId: @props.courseId, cnxId: info.next.cnx_id}>
      <div className='triangle' />
    </Router.Link>

  hasTargetHash: ->
    window.location.hash.length

  # used by BookContentMixin
  shouldOpenNewTab: -> false

  getTargetEl: ->
    targetSelector = window.location.hash
    pageEl = @getDOMNode()
    pageEl.querySelector(targetSelector)

  scrollToTarget: (targetEl) ->
    targetPosition = @getTopPosition(targetEl)
    window.scrollTo(0, targetPosition)

  triggerTargetHighlight: (targetEl) ->
    targetEl.classList.add('target')
    _.delay(->
      targetEl.classList.remove('target')
    , 1500)

  componentDidMount: ->
    return unless @hasTargetHash()

    targetEl = @getTargetEl()
    if targetEl?
      @scrollToTarget(targetEl)
      images = @getDOMNode().querySelectorAll('img')
      imagesToLoad = images.length
      onImageLoad = =>
        imagesToLoad -= 1
        # scroll is jumpy. TODO fix.
        @scrollToTarget(targetEl)
        if imagesToLoad is 0
          @triggerTargetHighlight(targetEl)

      for image in images
        image.addEventListener('load', onImageLoad)

  isExerciseLink: (link) ->
    link.pathname.search(EXERCISE_MATCHER) is 0

  # absolute url returned does not include the path to the api
  getExerciseAPIUrl: (link) ->
    "#{link.protocol}//#{link.host}/api#{link.pathname}"

  renderOtherLinks: (otherLinks) ->
    ReferenceBookExerciseStore.setMaxListeners(otherLinks.length)
    _.each(otherLinks, @renderExercise)

  renderExercise: (link) ->
    if @isExerciseLink(link)
      exerciseAPIUrl = @getExerciseAPIUrl(link)

      if link.parentNode.parentNode?
        @_exerciseNodes.push(link.parentNode.parentNode)
        React.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl}/>, link.parentNode.parentNode)

  unmountExerciseComponent: (node, nodeIndex) ->
    React.unmountComponentAtNode(node) if node?
    @_exerciseNodes.splice(nodeIndex, 1)

  componentWillUnmount: ->
    _.each(@_exerciseNodes, @unmountExerciseComponent)

  render: ->
    {courseId} = @context.router.getCurrentParams()
    # read the id from props, or failing that the url
    cnxId = @getCnxId()
    page = ReferenceBookPageStore.get(cnxId)
    info = ReferenceBookStore.getPageInfo({courseId, cnxId})

    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')
    <div className='page-wrapper'>
      {@prevLink(info) if info.prev}
      <ArbitraryHtmlAndMath className='page' block html={html} />
      {@nextLink(info) if info.next}
    </div>
