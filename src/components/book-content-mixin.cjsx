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

  getCNXIdOfURL: (url) ->
    _.last(url.split('contents/'))

  getMediaTag: (media) ->
    # form media tag text based on tag name or data-type
    tag = media.tagName
    tag = media.dataset.type if media.dataset.type?

    # capitalize
    # TODO find one place for all such string formating helpers to go
    tag = tag.charAt(0).toUpperCase() + tag.substring(1).toLowerCase()

  buildReferenceBookLink: ->
    referenceBookParams = _.clone(@context.router.getCurrentParams())
    referenceBookParams.cnxId = @getCNXId()
    pageUrl = @context.router.makeHref('viewReferenceBookPage', referenceBookParams)

    pageUrl

  isMediaLink: (link) ->
    link.innerText is '[link]' and link.hash.length > 0 and link.hash.search('/') is -1

  processLink: (mediaLink) ->
    return unless @isMediaLink(mediaLink)
    root = @getDOMNode()
    # Hash may not be a proper selector string, so try catch.
    try
      media = root.querySelector(mediaLink.hash)
      if media?
        tag = @getMediaTag(media)
        mediaLink.innerText = tag if tag?
      else
        # The link is external to this page
        mediaLink.target = '_blank'

        # If not already a reference book page,
        # make link to a reference book page.
        # assumes same/full page of current reading
        unless @constructor.displayName is 'ReferenceBookPage'
          pageUrl = @buildReferenceBookLink()
          mediaLink.href = pageUrl + mediaLink.hash

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
