React = require 'react'
_ = require 'underscore'
S = require '../helpers/string'
dom = require '../helpers/dom'

{MediaPreview} = require './media-preview'
{CourseStore} = require '../flux/course'
{TaskStepStore} = require '../flux/task-step'
{MediaStore} = require '../flux/media'

# According to the tagging legend exercises with a link should have `a.os-embed`
# but in the content they are just a vanilla link.
EXERCISE_LINK_SELECTOR = '.os-exercise > [data-type="problem"] > p > a[href]'
MEDIA_LINK_EXCLUDES = [
  '.nav'
  '.view-reference-guide'
  '[data-type=footnote-number]'
  '[data-type=footnote-ref]'
  '[data-targeted=media]'
]

MEDIA_LINK_SELECTOR = _.reduce(MEDIA_LINK_EXCLUDES, (current, exclude) ->
  "#{current}:not(#{exclude})"
, 'a')

LinkContentMixin =
  componentDidMount:  ->
    @processLinks()

  componentDidUpdate: ->
    @processLinks()

  contextTypes:
    router: React.PropTypes.func

  getCnxIdOfHref: (href) ->
    beforeHash = _.first(href.split('#'))
    _.last(beforeHash.split('/'))

  buildReferenceBookLink: (cnxId) ->
    {courseId} = @context.router.getCurrentParams()
    {query} = @props

    if cnxId?
      referenceBookLink = @context.router.makeHref( 'viewReferenceBookPage', { courseId, cnxId })
    else
      related_content = TaskStepStore.get(@props.id)?.related_content
      if related_content?
        section = @sectionFormat?(related_content[0]?.chapter_section or related_content[0]?.book_location)
        referenceBookLink = @context.router.makeHref('viewReferenceBookSection', {courseId, section}, query) if section?

    referenceBookLink

  isMediaLink: (link) ->
    (link.hash.length > 0 and link.hash.search('/') is -1) or link.href isnt link.getAttribute('href')

  hasCNXId: (link) ->
    trueHref = link.getAttribute('href')
    link.hash.length > 0 and trueHref.substr(0, 1) isnt '#'

  getMedia: (mediaId) ->
    root = @getDOMNode()
    root.querySelector("##{mediaId}")

  linkPreview: (link) ->
    mediaId = link.hash.replace('#', '')
    mediaDOM = @getMedia(mediaId) if mediaId
    mediaCNXId = @getCnxIdOfHref(link.getAttribute('href')) or @props.cnxId or @getCnxId?()

    previewNode = document.createElement('span')
    previewNode.classList.add('media-preview-wrapper')
    link.parentNode.replaceChild(previewNode, link)

    mediaProps =
      mediaId: mediaId
      cnxId: mediaCNXId
      bookHref: @buildReferenceBookLink(mediaCNXId)
      mediaDOMOnParent: mediaDOM
      shouldLinkElsewhere: @shouldOpenNewTab?()

    mediaPreview = <MediaPreview {...mediaProps}>
        {link.innerText}
      </MediaPreview>

    React.render(mediaPreview, previewNode)

  processLink: (link) ->
    if @isMediaLink(link)
      @linkPreview(link)
      return null
    else
      return link

  processLinks: ->
    _.defer(@_processLinks)

  _processLinks: ->
    return unless @isMounted()
    root = @getDOMNode()
    mediaLinks = root.querySelectorAll(MEDIA_LINK_SELECTOR)
    exerciseLinks = root.querySelectorAll(EXERCISE_LINK_SELECTOR)

    otherLinks = _.chain(mediaLinks)
      .map(@processLink)
      .compact()
      .uniq()
      .value()

    @renderOtherLinks?(otherLinks) if otherLinks?.length
    @renderExercises?(exerciseLinks) if exerciseLinks?.length

ReadingContentMixin =
  componentDidMount:  ->
    @insertOverlays()
    @detectImgAspectRatio()
    @processLinks()

  componentDidUpdate: ->
    @insertOverlays()
    @detectImgAspectRatio()
    @processLinks()

  contextTypes:
    router: React.PropTypes.func

  insertOverlays: ->
    title = @getSplashTitle()
    return unless title
    root = @getDOMNode()
    for img in root.querySelectorAll('.splash img')
      continue if img.parentElement.querySelector('.ui-overlay')
      overlay = document.createElement('div')
      # don't apply overlay twice or if cnx content already includes it
      continue if img.parentElement.querySelector('.tutor-ui-overlay')
      # Prefix the class to distinguish it from a class in the original HTML content
      overlay.className = 'tutor-ui-overlay'
      overlay.innerHTML = title
      img.parentElement.appendChild(overlay)

  detectImgAspectRatio: ->
    root = @getDOMNode()
    for img in root.querySelectorAll('img')
      if img.complete
        sizeImage.call(img)
      else
        img.onload = sizeImage


# called with the context set to the image
sizeImage = ->
  figure = dom.closest(@, 'figure')
  return unless figure
  if @naturalWidth > @naturalHeight
    figure.classList.add('tutor-ui-horizontal-img')
    if @naturalWidth > 450
      figure.classList.add('full-width')
  else
    figure.classList.add('tutor-ui-vertical-img')


BookContentMixin = _.extend({}, LinkContentMixin, ReadingContentMixin)

module.exports = {BookContentMixin, LinkContentMixin, ReadingContentMixin}
