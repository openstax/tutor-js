$ = require 'jquery'

start = (router) ->
  # Catch internal application links and let Backbone handle the routing
  $(document).on 'click', 'a[href]:not([data-bypass]):not([href^="#"])', (e) ->
    # Ignore if the link has already been intercepted
    return if e.isDefaultPrevented()

    # Don't intercept cmd/ctrl-clicks intended to open a link in a new tab
    return if e.metaKey or e.which is 2 or e.which is 3

    $this = $(this)
    href = $this.attr('href')

    # Only handle links intended to be processed by Backbone
    return if href.charAt(0) is '#'

    e.preventDefault()

    if $this.data('trigger') is false then trigger = false else trigger = true
    router.navigate(href, {trigger: trigger})


module.exports = {start}
