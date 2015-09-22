React = require 'react'
Router = require 'react-router'
_  = require 'underscore'

HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
{BookContentMixin} = require '../book-content-mixin'
GetPositionMixin = require '../get-position-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'

{ReferenceBookExerciseShell} = require './exercise'

{ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'
  propTypes:
    cnxId: React.PropTypes.string.isRequired
  mixins: [BookContentMixin, GetPositionMixin, ChapterSectionMixin]
  contextTypes:
    router: React.PropTypes.func
  componentWillMount: ->
    @setState(skipZeros: false)
  getSplashTitle: ->
    ReferenceBookStore.getPageTitle(@props)

  prevLink: (info) ->
    params = _.extend({}, @context.router.getCurrentParams(),
      section: @sectionFormat(info.prev.chapter_section))
    <Router.Link className='nav prev' to='viewReferenceBookSection'
      query={@context.router.getCurrentQuery()}
      params={params}>
      <div className='triangle' />
    </Router.Link>

  nextLink: (info) ->
    params = _.extend({}, @context.router.getCurrentParams(),
      section: @sectionFormat(info.next.chapter_section))

    <Router.Link className='nav next' to='viewReferenceBookSection'
      query={@context.router.getCurrentQuery()}
      params={params}>
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

  renderExercises: (exerciseLinks) ->
    ReferenceBookExerciseStore.setMaxListeners(exerciseLinks.length)
    allExercises = _.pluck(exerciseLinks, 'href')
    multipleUrl = ReferenceBookExerciseStore.getMultipleUrl(allExercises)
    ReferenceBookExerciseActions.load(multipleUrl) unless ReferenceBookExerciseStore.isLoaded(multipleUrl)

    _.each(exerciseLinks, @renderExercise)

  renderExercise: (link) ->
    exerciseAPIUrl = link.href
    exerciseNode = link.parentNode.parentNode
    React.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl}/>, exerciseNode) if exerciseNode?

  render: ->
    {courseId, cnxId, className, ecosystemId} = @props
    # read the id from props, or failing that the url
    page = ReferenceBookPageStore.get(cnxId)
    info = ReferenceBookStore.getPageInfo({ecosystemId, cnxId})

    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')

    if className?
      className += ' page-wrapper'
    else
      className = 'page-wrapper'

    <div className={className}>
      {@props.children}
      {@prevLink(info) if info.prev}
      <ArbitraryHtmlAndMath className='page' block html={html} />
      {@nextLink(info) if info.next}
    </div>
