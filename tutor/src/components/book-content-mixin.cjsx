React = require 'react'
ReactDOM = require 'react-dom'
_ = require 'underscore'
S = require '../helpers/string'
dom = require '../helpers/dom'

{MediaPreview} = require './media-preview'
{TaskStepStore} = require '../flux/task-step'
{MediaStore} = require '../flux/media'
{default: Courses} = require '../models/courses-map'

ScrollToLinkMixin = require './scroll-to-link-mixin'

Router = require '../helpers/router'

# According to the tagging legend exercises with a link should have `a.os-embed`
# but in the content they are just a vanilla link.
EXERCISE_LINK_SELECTOR = [
  '.os-exercise > [data-type="problem"] > p > a[href]'
  '.ost-exercise > [data-type="problem"] > p > a[href]'
].join(', ')

LEARNING_OBJECTIVE_SELECTORS = '.learning-objectives, [data-type=abstract]'
IS_INTRO_SELECTORS = '.splash img, [data-type="cnx.flag.introduction"]'

LinkContentMixin =
  componentDidMount:  ->
    @_linkContentIsMounted = true
    @processLinks()

  componentDidUpdate: ->
    @processLinks()

  componentWillUnmount: ->
    @_linkContentIsMounted = false
    @cleanUpLinks()

  getCnxIdOfHref: (href) ->
    beforeHash = _.first(href.split('#'))
    _.last(beforeHash.split('/'))

  buildReferenceBookLink: (cnxId) ->
    {courseId, ecosystemId} = Router.currentParams()
    {query, id} = @props

    if ecosystemId and not courseId
      courseId = _.findWhere(Courses.array, {ecosystem_id: ecosystemId})?.id

    # suboptimal but is the best we can as long as the reference book depends on having a courseId in url
    return null unless courseId

    if id?
      related_content = TaskStepStore.get(id)?.related_content

      if related_content?
        section = @sectionFormat?(related_content[0]?.chapter_section or related_content[0]?.book_location)
        referenceBookLink = Router.makePathname('viewReferenceBookSection', {courseId, section}, query) if section?
    else if cnxId?
      referenceBookLink = Router.makePathname( 'viewReferenceBookPage', { courseId, cnxId })

    referenceBookLink

  isMediaLink: (link) ->
    # TODO it's likely that this is no longer needed since the links being
    # passed into this are now much stricter and exclude where `href="#"` and
    # where `href` contains any `/`
    (link.hash.length > 0 or link.href isnt link.getAttribute('href')) and (link.hash.search('/') is -1)

  hasCNXId: (link) ->
    trueHref = link.getAttribute('href')
    link.hash.length > 0 and trueHref.substr(0, 1) isnt '#'

  getMedia: (mediaId) ->
    root = ReactDOM.findDOMNode(@)
    try
      root.querySelector("##{mediaId}")
    catch error
      # silently handle error in case selector is
      # still invalid.
      console.warn(error)
      false

  cleanUpLinks: ->
    root = ReactDOM.findDOMNode(@)
    previewNodes = root.getElementsByClassName('media-preview-wrapper')

    _.each(previewNodes, (previewNode) ->
      ReactDOM.unmountComponentAtNode(previewNode)
    )

  linkPreview: (link) ->
    mediaId = link.hash.replace('#', '')
    mediaDOM = @getMedia(mediaId) if mediaId

    # no need to set up media preview if
    # media id is invalid.
    return link if mediaDOM is false

    mediaCNXId = @getCnxIdOfHref(link.getAttribute('href')) or @props.cnxId or @getCnxId?()
    previewNode = document.createElement('span')
    previewNode.classList.add('media-preview-wrapper')
    link.parentNode.replaceChild(previewNode, link)

    mediaProps =
      mediaId: mediaId
      cnxId: mediaCNXId
      bookHref: @buildReferenceBookLink(mediaCNXId)
      mediaDOMOnParent: mediaDOM
      shouldLinkOut: @shouldOpenNewTab?()
      originalHref: link.getAttribute('href')

    mediaPreview = <MediaPreview {...mediaProps}>
        {link.innerText}
      </MediaPreview>

    ReactDOM.render(mediaPreview, previewNode)
    return null

  processLink: (link) ->
    if @isMediaLink(link)
      @linkPreview(link)
    else
      return link

  processLinks: ->
    _.defer(@_processLinks)

  _processLinks: ->
    return unless @_linkContentIsMounted
    root = ReactDOM.findDOMNode(@)
    mediaLinks = root.querySelectorAll(MediaStore.getSelector())
    exerciseLinks = root.querySelectorAll(EXERCISE_LINK_SELECTOR)

    otherLinks = _.chain(mediaLinks)
      .map(@processLink)
      .compact()
      .uniq()
      .value()

    @renderOtherLinks?(otherLinks) if otherLinks?.length
    @renderExercises?(exerciseLinks) if exerciseLinks?.length

ReadingContentMixin =

  mixins: [ ScrollToLinkMixin ]

  componentDidMount:  ->
    @_linkContentIsMounted = true
    @insertCanonicalLink()
    @insertOverlays()
    @detectImgAspectRatio()
    @cleanUpAbstracts()
    @processLinks()

  componentDidUpdate: ->
    @updateCanonicalLink()
    @insertOverlays()
    @detectImgAspectRatio()
    @cleanUpAbstracts()
    @processLinks()

  componentWillUnmount: ->
    @removeCanonicalLink()

  insertCanonicalLink: ->
    @linkNode = document.createElement('link')
    @linkNode.rel = 'canonical'
    document.head.appendChild(@linkNode)

    @updateCanonicalLink()

  updateCanonicalLink: ->
    cnxId = @props.cnxId or @getCnxId?()
    # leave versioning out of canonical link
    canonicalCNXId = _.first(cnxId.split('@'))
    {courseId} = Router.currentParams()
    {webview_url} = CourseStore.get(courseId)
    baseWebviewUrl = _.first(webview_url.split('/contents/'))

    # webview actually links to webview_url as it's canonical url.
    # will need to ask them why.
    @linkNode.href = "#{baseWebviewUrl}/contents/#{canonicalCNXId}"

  removeCanonicalLink: ->
    # document.head.
    @linkNode.remove()

  insertOverlays: ->
    title = @getSplashTitle()
    return unless title
    root = ReactDOM.findDOMNode(@)
    for img in root.querySelectorAll('.splash img')
      continue if img.parentElement.querySelector('.ui-overlay')
      overlay = document.createElement('div')
      # don't apply overlay twice or if cnx content already includes it
      continue if img.parentElement.querySelector('.tutor-ui-overlay')
      # Prefix the class to distinguish it from a class in the original HTML content
      overlay.className = 'tutor-ui-overlay'
      overlay.innerHTML = title
      img.parentElement.appendChild(overlay)

  cleanUpAbstracts: ->
    root = ReactDOM.findDOMNode(@)
    abstract = root.querySelector(LEARNING_OBJECTIVE_SELECTORS)
    # dont clean up if abstract does not exist or if it has already been cleaned up
    return if not abstract? or abstract.dataset.isIntro?

    for abstractChild in abstract.childNodes
      # leave the list alone -- this is the main content
      continue if not abstractChild? or abstractChild.tagName is 'UL'

      text = (abstractChild.textContent or '').trim()

      # grab text if relevant and set as preamble
      if abstractChild.dataset?.type isnt 'title' and text
        abstract.dataset.preamble = text

      # remove all non-lists children to prevent extra text in preamble
      abstractChild.remove?()

    abstract.dataset.isIntro = root.querySelector(IS_INTRO_SELECTORS)?

  detectImgAspectRatio: ->
    root = ReactDOM.findDOMNode(@)
    for img in root.querySelectorAll('img')
      if img.complete
        sizeImage.call(img)
      else
        img.onload = sizeImage


# called with the context set to the image
sizeImage = ->
  figure = dom.closest(@, 'figure')
  return unless figure

  aspectRatio = @naturalWidth / @naturalHeight

  # let wide, square, and almost square figures be natural.
  if aspectRatio > 0.9 or figure.parentNode.dataset.orient is 'horizontal'
    figure.classList.add('tutor-ui-horizontal-img')
    if @naturalWidth > 450 and figure.parentNode?.nodeName isnt 'FIGURE'
      figure.classList.add('full-width')
  else
    figure.classList.add('tutor-ui-vertical-img')


BookContentMixin = _.extend({}, LinkContentMixin, ReadingContentMixin)

module.exports = {BookContentMixin, LinkContentMixin, ReadingContentMixin}
