React = require 'react'
{SpyMode} = require 'openstax-react-components'

_  = require 'underscore'
classnames = require 'classnames'

{BookContentMixin} = require '../book-content-mixin'
{ArbitraryHtmlAndMath, GetPositionMixin} = require 'openstax-react-components'

{ReferenceBookExerciseShell} = require './exercise'

{ReferenceBookPageStore} = require '../../flux/reference-book-page'
{ReferenceBookStore} = require '../../flux/reference-book'
{ReferenceBookExerciseActions, ReferenceBookExerciseStore} = require '../../flux/reference-book-exercise'

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

    html = page.content_html
    # FIXME the BE sends HTML with head and body
    # Fixing it with nasty regex for now
    html = html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '')

    <div className={classnames('page-wrapper', @props.className)}>
      {@props.children}

      <ArbitraryHtmlAndMath className='page center-panel' block html={html} />

      <SpyMode.Content className="ecosystem-info">
        PageId: {@props.cnxId}, Ecosystem: {page.spy}
      </SpyMode.Content>

    </div>
