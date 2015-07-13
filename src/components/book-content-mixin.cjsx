_ = require 'underscore'

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
    _.first(url.split('#'))

  getMediaTag: (media) ->
    # form media tag text based on tag name or data-type
    tag = media.tagName
    tag = media.dataset.type if media.dataset.type?

    # capitalize
    # TODO find one place for all such string formating helpers to go
    tag = tag.charAt(0).toUpperCase() + tag.substring(1).toLowerCase()

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

  processLink: (mediaLink) ->
    return unless @isMediaLink(mediaLink)
    root = @getDOMNode()

    # Media link has cnxId preceding the target element.
    # This is a link to a target on another page entirely.
    # Get the cnxId from the href attribute.
    if @hasCNXId(mediaLink)
      mediaCNXId = @getCNXIdOfHref(mediaLink.getAttribute('href'))
    else
      # Media link does not have an explicit cnxId in the href.
      # Hash may not be a proper selector string, so try catch
      # to see whether the media is on this step or page.
      try
        media = root.querySelector(mediaLink.hash)
        if media?
          # Media is found on step/page, set link text.
          tag = @getMediaTag(media)
          mediaLink.innerText = tag if tag?
        else
          # Media is not found on step or page, and there is not a cnxId on the href.
          # This probably a link on an iReading to a target on the same page,
          # that is left out of the iReading.
          # Assume that the cnxId is this same page.
          mediaCNXId = @getCNXId()

    # A new pageUrl is made for media links where the media is not found within the DOM.
    if mediaCNXId?
      pageUrl = @buildReferenceBookLink(mediaCNXId)
      mediaLink.href = pageUrl + mediaLink.hash
      # Make link external only if this is not already a ref book page.
      mediaLink.target = '_blank' unless @constructor.displayName is 'ReferenceBookPage'

  processLinks: ->
    root = @getDOMNode()
    linkSelector = 'a:not(.nav):not([data-type=footnote-number]):not([data-type=footnote-ref])'
    mediaLinks = root.querySelectorAll(linkSelector)

    _.each(mediaLinks, @processLink)


# called with the context set to the image
sizeImage = ->
  if @naturalWidth > @naturalHeight
    @parentNode.classList.add('tutor-ui-horizontal-img')
    if @naturalWidth > 450
      @parentNode.classList.add('full-width')
  else
    @parentNode.classList.add('tutor-ui-vertical-img')
