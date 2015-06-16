module.exports =
  componentDidMount:  ->
    @insertOverlays()
    @detectImgAspectRatio()

  componentDidUpdate: ->
    @insertOverlays()
    @detectImgAspectRatio()

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
      # Wait until an image loads before trying to detect its dimensions
      img.onload = ->
        if @width > @height
          @parentNode.classList.add('tutor-ui-horizontal-img')
        else
          @parentNode.classList.add('tutor-ui-vertical-img')
