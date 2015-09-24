React = require 'react'
Router = require 'react-router'
_  = require 'underscore'
classnames = require 'classnames'

HTML = require '../html'
ArbitraryHtmlAndMath = require '../html'
{BookContentMixin} = require '../book-content-mixin'
GetPositionMixin = require '../get-position-mixin'
ChapterSectionMixin = require '../chapter-section-mixin'
SpyModeContent = require '../spy-mode/content'

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

  # used by BookContentMixin
  shouldOpenNewTab: -> true

  waitToScrollToSelector: (hash) ->
    images = @getDOMNode().querySelectorAll('img')
    imagesToLoad = images.length
    onImageLoad = =>
      imagesToLoad -= 1
      if imagesToLoad is 0
        # final scroll to
        @scrollToSelector(hash)
    for image in images
      image.addEventListener('load', onImageLoad)

    images.length > 0

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
    {courseId, cnxId, ecosystemId} = @props
    # read the id from props, or failing that the url
    page = ReferenceBookPageStore.get(cnxId)
    info = ReferenceBookStore.getPageInfo({ecosystemId, cnxId})

    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')

    <div className={classnames('page-wrapper', @props.className)}>
      {@props.children}
      {@prevLink(info) if info.prev}
      <ArbitraryHtmlAndMath className='page' block html={html} />
      {@nextLink(info) if info.next}
      <SpyModeContent className="ecosystem-info">
        PageId: {@props.cnxId}, Ecosystem: {page.ecosystem_title}
      </SpyModeContent>
    </div>
