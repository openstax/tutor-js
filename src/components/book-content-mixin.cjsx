React = require 'react'
_ = require 'underscore'
S = require '../helpers/string'
dom = require '../helpers/dom'

MediaPreview = require './media-preview'
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

  getMediaTag: (media) ->
    # form media tag text based on data-type or tag name
    tag = media.getAttribute('data-type') or media.tagName
    S.capitalize(tag)

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

  linkMediaElsewhere: (mediaCNXId, mediaLink) ->
    pageUrl = @buildReferenceBookLink(mediaCNXId)
    mediaLink.href = pageUrl + mediaLink.hash
    mediaLink.target = '_blank' if @shouldOpenNewTab?()
    # do this to ignore this link once adjusted
    mediaLink.dataset.targeted = 'media'

  isMediaLoaded: (link) ->
    mediaId = link.hash.replace('#', '')
    media = MediaStore.get(mediaId)

    media?

  linkPreview: (link) ->
    mediaId = link.hash.replace('#', '')
    React.render(<MediaPreview mediaId={mediaId}>{link.innerText}</MediaPreview>, link)

  processLink: (link) ->
    if @isMediaLink(link)
      if not @hasCNXId(link) and @isMediaLoaded(link)
        @linkPreview(link)
        return null
      else
        @linkToAnotherPage(link)
        return null
    else
      return link

  linkToAnotherPage: (link) ->
    mediaCNXId = @getCnxIdOfHref(link.getAttribute('href')) or @props.cnxId or @getCnxId?()
    @linkMediaElsewhere(mediaCNXId, link)

  linkToThisPage: (link) ->
    root = @getDOMNode()
    media = root.querySelector(link.hash)
    tag = @getMediaTag(media)
    link.innerText = tag if link.innerText is '[link]' and tag?
    link.target = '_self'
    # do this to ignore this link once adjusted
    link.dataset.targeted = 'media'
    link.parentNode.insertBefore(media.cloneNode(true), link.nextSibling)

  processLinks: ->
    root = @getDOMNode()
    mediaLinks = root.querySelectorAll(MEDIA_LINK_SELECTOR)
    exerciseLinks = root.querySelectorAll(EXERCISE_LINK_SELECTOR)

    otherLinks = _.chain(mediaLinks)
      .map(@processLink)
      .compact()
      .uniq()
      .value()

    @renderOtherLinks?(otherLinks)
    @renderExercises?(exerciseLinks)

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
