# Simple jQuery.ajax() shim that calls back
# from https://github.com/philschatz/octokat.js
ajax = (options, cb) ->

  # Use the browser XMLHttpRequest if it exists. If not, then this is NodeJS
  # Pull this in for every request so sepia.js has a chance to override `window.XMLHTTPRequest`
  if window?
    XMLHttpRequest = window.XMLHttpRequest

  xhr = new XMLHttpRequest()
  xhr.dataType = options.dataType
  xhr.overrideMimeType?(options.mimeType)
  xhr.open(options.type, options.url)

  if options.data and options.type isnt 'GET'
    xhr.setRequestHeader('Content-Type', options.contentType)

  for name, value of options.headers
    xhr.setRequestHeader(name, value)

  xhr.onreadystatechange ->
    if 4 is xhr.readyState
      options.statusCode?[xhr.status]?()

      if xhr.status >= 200 and xhr.status < 300 or xhr.status is 304 or xhr.status is 302
        cb(null, xhr)
      else
        cb(xhr)
  xhr.send(options.data)


module.exports = ajax
