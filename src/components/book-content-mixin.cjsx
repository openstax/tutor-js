_ = require 'underscore'
S = require '../helpers/string'

# According to the tagging legend exercises with a link should have `a.os-embed`
# but in the content they are just a vanilla link.
EXERCISE_LINK_SELECTOR = '.os-exercise > [data-type="problem"] > p > a[href]'
MEDIA_LINK_SELECTOR = 'a:not(.nav):not([data-type=footnote-number]):not([data-type=footnote-ref])'

module.exports =
  componentDidMount:  ->
    @insertOverlays()
    @detectImgAspectRatio()
    @processLinks()

  componentDidUpdate: ->
    @insertOverlays()
    @detectImgAspectRatio()
    @processLinks()

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

  getCNXIdOfHref: (href) ->
    beforeHash = _.first(href.split('#'))
    _.last(beforeHash.split('/'))

  getMediaTag: (media) ->
    # form media tag text based on data-type or tag name
    tag = media.getAttribute('data-type') or media.tagName
    S.capitalize(tag)

  buildReferenceBookLink: (cnxId) ->
    referenceBookParams = _.clone(@context.router.getCurrentParams())
    referenceBookParams.cnxId = cnxId or @getCNXId()
    pageUrl = @context.router.makeHref('viewReferenceBookPage', referenceBookParams)

    pageUrl

  isMediaLink: (link) ->
    link.innerText is '[link]' and link.hash.length > 0 and link.hash.search('/') is -1

  hasCNXId: (link) ->
    trueHref = link.getAttribute('href')
    link.hash.length > 0 and trueHref.substr(0, 1) isnt '#'

  linkMediaElsewhere: (mediaCNXId, mediaLink) ->
    pageUrl = @buildReferenceBookLink(mediaCNXId)
    mediaLink.href = pageUrl + mediaLink.hash
    mediaLink.target = '_blank' if @shouldOpenNewTab?()

  isMediaOnPage: (link) ->
    root = @getDOMNode()
    try
      media = root.querySelector(link.hash)

    media?

  processLink: (link) ->
    if @isMediaLink(link)
      if not @hasCNXId(link) and @isMediaOnPage(link)
        @linkToThisPage(link)
        return null
      else
        @linkToAnotherPage(link)
        return null
    else
      return link

  linkToAnotherPage: (link) ->
    mediaCNXId = @getCNXIdOfHref(link.getAttribute('href')) or @getCNXId()
    @linkMediaElsewhere(mediaCNXId, link) if mediaCNXId?

  linkToThisPage: (link) ->
    root = @getDOMNode()
    media = root.querySelector(link.hash)
    tag = @getMediaTag(media)
    link.innerText = tag if tag?

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


# called with the context set to the image
sizeImage = ->
  return unless @parentNode
  if @naturalWidth > @naturalHeight
    @parentNode.classList.add('tutor-ui-horizontal-img')
    if @naturalWidth > 450
      @parentNode.classList.add('full-width')
  else
    @parentNode.classList.add('tutor-ui-vertical-img')
