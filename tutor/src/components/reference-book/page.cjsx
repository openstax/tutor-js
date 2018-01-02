React = require 'react'
ReactDOM  = require 'react-dom'
{SpyMode, ArbitraryHtmlAndMath, GetPositionMixin} = require 'shared'
{observer} = require 'mobx-react'
classnames = require 'classnames'

{BookContentMixin} = require '../book-content-mixin'

{default: {ReferenceBookExerciseShell}} = require './exercise'
RelatedContent = require '../related-content'
{default: Loading} = require '../loading-screen'

Router = require '../../helpers/router'
Dialog = require '../dialog'
{default: AnnotationWidget} = require '../annotations/annotation'
{ ReferenceBookExerciseActions, ReferenceBookExerciseStore } = require '../../flux/reference-book-exercise'
{ map, forEach } = require 'lodash'

ReferenceBookPage = React.createClass
  displayName: 'ReferenceBookPage'

  propTypes:
    ux: React.PropTypes.object.isRequired

  mixins: [BookContentMixin, GetPositionMixin]

  getCnxId: ->
    this.props.ux.activePage.cnx_id

  componentWillMount: ->
    this.props.ux.activePage.ensureLoaded()

  componentWillReceiveProps: (nextProps) ->
    @props.ux.activePage.ensureLoaded()

  getSplashTitle: ->
    this.props.ux.activePage.title

  componentDidUpdate: ->
    this.props.ux.checkForTeacherContent()

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
    allExercises = map(exerciseLinks, 'href')
    multipleUrl = ReferenceBookExerciseStore.getMultipleUrl(allExercises)
    ReferenceBookExerciseActions.load(multipleUrl) unless ReferenceBookExerciseStore.isLoaded(multipleUrl)

    forEach(exerciseLinks, @renderExercise)

  renderExercise: (link) ->
    exerciseAPIUrl = link.href
    exerciseNode = link.parentNode.parentNode
    ReactDOM.render(<ReferenceBookExerciseShell exerciseAPIUrl={exerciseAPIUrl}/>, exerciseNode) if exerciseNode?

  render: ->
    { ux, ux: { activePage: page } } = @props

    if not page or page.api.isPending
      if ux.lastSection
        isLoading = true
        page = ux.pages.get(ux.lastSection)
      else
        return <Loading />


    related =
      chapter_section: page.chapter_section.asArray
      title: @getSplashTitle()

    <div
      className={
        classnames('page-wrapper', @props.className,
          {'page-loading loadable is-loading': isLoading})
      }
      {...ux.courseDataProps}
    >
      {@props.children}
      <div className='page center-panel'>
        <RelatedContent
          contentId={page.cnx_id} {...related}
        />
        <ArbitraryHtmlAndMath className='book-content' block html={page.contents} />
      </div>

      <SpyMode.Content className="ecosystem-info">
        PageId: {page.cnx_id}, Ecosystem: {JSON.stringify(page?.spy)}
      </SpyMode.Content>

      <AnnotationWidget
        courseId={ux.course.id}
        chapter={page.chapter_section.chapter}
        section={page.chapter_section.section}
        title={related.title}
        documentId={page.cnx_id}
      />
    </div>

module.exports = observer(ReferenceBookPage)
