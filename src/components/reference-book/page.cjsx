React = require 'react'
Router = require 'react-router'
BS = require 'react-bootstrap'
_  = require 'underscore'

HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
BookContentMixin = require '../book-content-mixin'
GetPositionMixin = require '../get-position-mixin'

{ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookStore} = require '../../flux/reference-book'

module.exports = React.createClass
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
      <i className='prev fa fa-chevron-left'/>
    </Router.Link>

  nextLink: (info) ->
    <Router.Link className='nav next' to='viewReferenceBookPage'
      params={courseId: @props.courseId, cnxId: info.next.cnx_id}>
      <i className='fa fa-chevron-right'/>
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
