# Add the following data into a log that can be included when filing a ticket
# to help developers recreate an issue. This can be enabled/disabled programmatically
# or just by adding `?debug=true` to the URL.
# The log is stored as a global variable `__REPLAY_LOG`
#
# - [x] recent HTTP errors
# - [x] all the JS exceptions that were thrown
# - [x] recent set of elements that were clicked
# - [x] how the URL recently changed

Clipboard = require 'clipboard'
listen = require 'good-listener'

MAX_LOG_SIZE = 100

OriginalXMLHttpRequest = window.XMLHttpRequest
originalOnError = window.onerror
originalOnPopState = window.onpopstate

isStarted = false
clipboard = null
clickListener = null
replayCount = null
controlsDiv = null


REPLAY_LOG = null
PREVIOUS_PATH = window.location.pathname
log = (type, args...) ->
  _internalLog = (type, args...) ->
    replayCount?.textContent = REPLAY_LOG.length
    # console.log type, args...
    REPLAY_LOG.push([type, args...])
    # Discard the oldest entry
    if REPLAY_LOG.length > MAX_LOG_SIZE
      REPLAY_LOG.shift()

  # History: Since there are no pushState events, we poll here to see if
  # there are any changes to the URL
  path = window.location.pathname
  if path isnt PREVIOUS_PATH
    PREVIOUS_PATH = path
    _internalLog('HISTORY', 'CHANGE', window.location.pathname)
  _internalLog(type, args...)


# Wrap the XMLHttpRequest so we can report timeouts, errors, or success
class WrappedXMLHttpRequest
  constructor: ->
    @_xhr = new OriginalXMLHttpRequest()
    # Users can use `onreadystatechange` or `onload` (or both) but only report once
    @_xhr.onload = @_onload.bind(@)
    @_xhr.onerror = @_onerror.bind(@)

    Object.defineProperties @,
      onreadystatechange:
        get: => @_xhr.onreadystatechange
        set: (v) => @_xhr.onreadystatechange = v
      readyState: get: => @_xhr.readyState
      response: get: => @_xhr.response
      responseText: get: => @_xhr.responseText
      responseType:
        get: => @_xhr.responseType
        set: (v) => @_xhr.responseType = v
      responseXML: get: => @_xhr.responseXML
      status: get: => @_xhr.status
      statusText: get: => @_xhr.statusText
      # TODO: Use `ontimeout` and `abort` more in our code
      timeout:
        get: => @_xhr.timeout
        set: (v) => @_xhr.timeout = v
      ontimeout:
        get: => @_xhr.ontimeout
        set: (v) => @_xhr.ontimeout = v
      onload:
        get: => @_clientOnLoad
        set: (v) => @_clientOnLoad = v
      onerror:
        get: => @_clientOnError
        set: (v) => @_clientOnError = v
      upload: get: => @_xhr.upload
      withCredentials:
        get: => @_xhr.withCredentials
        set: (v) => @_xhr.withCredentials = v

  _onload: (args...) ->
    responseText = @responseText if @responseType is '' or @responseType is 'text'
    log('XHR', 'load', @_method, @_url, @status, responseText)
    @_clientOnLoad?(args...)

  _onerror: (args...) ->
    responseText = @responseText if @responseType is '' or @responseType is 'text'
    log('XHR', 'error', @_method, @_url, @status, responseText)
    @_clientOnError?(args...)

  abort: (args...) -> @_xhr.abort(args...)
  open: (args...) ->
    # Save the method and URL for logging later
    [@_method, @_url] = args
    @_xhr.open(args...)
  getAllResponseHeaders: (args...) -> @_xhr.getAllResponseHeaders(args...)
  getResponseHeader: (args...) -> @_xhr.getResponseHeader(args...)
  overrideMimeType: (args...) -> @_xhr.overrideMimeType(args...)
  send: (args...) ->
    if typeof args[0] is 'string'
      @_data = args[0]
    log('XHR', 'start', @_method, @_url, @_data)
    @_xhr.send(args...)
  setRequestHeader: (args...) -> @_xhr.setRequestHeader(args...)


# Log all uncaught errors
loggedOnError = (msg, url, line, column, err) ->
  log('UNCAUGHT', msg, url, line, column, err)
  originalOnError?(msg, url, line, column, err)


# If the user presses the back or foreward browser buttons then log it!
loggedOnPopState = (evt) ->
  try
    # Make sure evt.state is serializable. Otherwise, don't use it
    JSON.stringify(evt.state)

  log('HISTORY', 'POP', window.location.pathname, evt.state)
  originalOnPopState?(evt)




generateSelector = (target) ->
  selector = [target.tagName.toLowerCase()]
  for i in [0...target.attributes.length]
    attr = target.attributes.item(i)
    if attr.name is 'class'
      selector.push(".#{attr.value.split(' ').join('.')}")
    else if attr.name is 'id'
      selector.push("##{attr.value}")
    else if attr.name isnt 'data-reactid' # skip the react attribute
      selector.push("[#{attr.name}='#{attr.value}']")
  selector.join('')


logClickHandler = (evt) ->
  {target} = evt

  return if target.classList.contains('-replay') # Do not log clicks on the replay buttons

  selector = generateSelector(target)
  # React frequently injects spans that have nothing on them.
  # If that is the case then use the parent selector
  if selector is 'span'
    target = target.parentElement
    selector = generateSelector(target) + '>span'

  extra = undefined

  switch target.tagName.toLowerCase()
    when 'button' then extra = target.innerText
    when 'input' then extra = target.value
    when 'a' then extra = target.href

  # Build up a unique selector
  log('CLICK', selector, extra)


clearLog = ->
  REPLAY_LOG.splice(0, REPLAY_LOG.length)


start = (config = {}) ->
  return if isStarted

  if window.localStorage['__REPLAY_LOG']
    REPLAY_LOG = JSON.parse(window.localStorage['__REPLAY_LOG'])
  else
    REPLAY_LOG = []

  # TODO: Load the REPLAY_LOG from localStorage if available (this helps with pages going to a login page and then coming back)
  window.__REPLAY_LOG = REPLAY_LOG
  window.XMLHttpRequest = WrappedXMLHttpRequest
  window.onerror = loggedOnError
  window.onpopstate = loggedOnPopState

  clickListener = listen('*:not(.-replay)', 'click', logClickHandler)

  controlsDiv = document.querySelector('.-replay-controls')
  # Create a button if one does not already exist
  unless controlsDiv
    controlsDiv = document.createElement('div')
    controlsDiv.classList.add('-replay')
    controlsDiv.classList.add('-replay-controls')
    document.body.appendChild(controlsDiv)

  stopBtn = document.querySelector('.-replay-stop')
  # Create a button if one does not already exist
  unless stopBtn
    stopBtn = document.createElement('button')
    stopBtn.classList.add('-replay')
    stopBtn.classList.add('-replay-stop')
    stopBtn.textContent = 'X'
    stopBtn.title = 'Stop ReplayLog Entirely. You will need to restart by adding ?collect=true to the URL'
    controlsDiv.appendChild(stopBtn)

  clearBtn = document.querySelector('.-replay-clear-log')
  # Create a button if one does not already exist
  unless clearBtn
    clearBtn = document.createElement('button')
    clearBtn.classList.add('-replay')
    clearBtn.classList.add('-replay-clear-log')
    clearBtn.textContent = 'Clear'
    clearBtn.title = 'Clear the log. Useful when starting a new test'
    controlsDiv.appendChild(clearBtn)

  copyBtn = document.querySelector('.-replay-copy-to-clipboard')
  # Create a button if one does not already exist
  unless copyBtn
    copyBtn = document.createElement('button')
    copyBtn.classList.add('-replay')
    copyBtn.classList.add('-replay-copy-to-clipboard')
    copyBtn.textContent = 'Copy'
    copyBtn.title = '''
      Copies the log to the clipboard.
      In Safari you need to click this and then press Press ⌘-C to copy to the clipboard
    '''
    controlsDiv.appendChild(copyBtn)

  replayCount = document.querySelector('.-replay-count')
  unless replayCount
    replayCount = document.createElement('span')
    replayCount.classList.add('-replay')
    replayCount.classList.add('-replay-count')
    replayCount.textContent = REPLAY_LOG.length
    controlsDiv.appendChild(replayCount)

  # Add a button to copy to clipboard
  clipboard = new Clipboard copyBtn,
    text: -> JSON.stringify(REPLAY_LOG)

  clearBtn.addEventListener 'click', ->
    # Clear the log without making a new array (because it's a global var)
    clearLog()
    delete window.localStorage['__REPLAY_LOG']
    replayCount.textContent = REPLAY_LOG.length

  stopBtn.addEventListener 'click', -> stop()

  window.addEventListener 'beforeunload', ->
    return unless isStarted
    log('HISTORY', 'UNLOAD')
    window.localStorage['__REPLAY_LOG'] = JSON.stringify(REPLAY_LOG)

  isStarted = true
  window.localStorage['__REPLAY_AUTO_START'] = true

stop = ->
  clearLog()
  delete window.__REPLAY_LOG
  window.XMLHttpRequest = OriginalXMLHttpRequest
  window.onerror = originalOnError
  window.onpopstate = originalOnPopState
  clipboard.destroy()
  clickListener.destroy()
  delete window.localStorage['__REPLAY_AUTO_START']
  delete window.localStorage['__REPLAY_LOG']
  controlsDiv.remove()
  isStarted = false


# If the URL has the special `?debug=true` the start automatically
if /collect=true/.test(window.location.search)
  start()
else if /collect=false/.test(window.location.search)
  stop()

start() if window.localStorage['__REPLAY_AUTO_START']

module.exports = {start, stop, isStarted: -> isStarted}
