React = require 'react'
ReactDOM  = require 'react-dom'
{SpyMode} = require 'shared'

_  = require 'underscore'
classnames = require 'classnames'

{BookContentMixin} = require '../book-content-mixin'
{ArbitraryHtmlAndMath, GetPositionMixin} = require 'shared'

{ReferenceBookExerciseShell} = require './exercise'
RelatedContent = require '../related-content'

{ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

Router = require '../../helpers/router'
Dialog = require '../dialog'
{default: AnnotationWidget} = require '../annotations/annotation'

module.exports = React.createClass
  displayName: 'ReferenceBookPage'
  propTypes:
    cnxId: React.PropTypes.string.isRequired
  mixins: [BookContentMixin, GetPositionMixin]
  componentWillMount: ->
    @setState(skipZeros: false)

  getSplashTitle: ->
    ReferenceBookStore.getPageTitle(@props)

  # used by BookContentMixin
  shouldOpenNewTab: -> true

  waitToScrollToSelector: (hash) ->
    images = ReactDOM.findDOMNode(@).querySelectorAll('img')
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
    ReactDOM.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl}/>, exerciseNode) if exerciseNode?

  render: ->
    {courseId, cnxId, ecosystemId} = @props
    if (not courseId)
      {courseId} = Router.currentParams()

    # read the id from props, or failing that the url
    page = ReferenceBookPageStore.get(cnxId)

    html = page?.content_html or ''
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')

    related =
      chapter_section: @props.section
      title: @getSplashTitle()

    <div className={classnames('page-wrapper', @props.className)}>
      {@props.children}
      <div className='page center-panel'>
        <RelatedContent contentId={cnxId} {...related} />

        <ArbitraryHtmlAndMath className='book-content' block html={html} />
      </div>

      <SpyMode.Content className="ecosystem-info">
        PageId: {@props.cnxId}, Ecosystem: {JSON.stringify(page?.spy)}
      </SpyMode.Content>

      <AnnotationWidget
        courseId={courseId}
        chapter={page.chapter_section[0]}
        section={page.chapter_section[1]}
        title={related.title}
        documentId={@props.cnxId}
      />
    </div>
