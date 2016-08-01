module.exports = {

  replaceBrowserLocation: (url) ->
    window.location.replace(url) unless window.__karma__

}
