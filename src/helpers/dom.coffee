module.exports = {

  matches: (el, selector) ->
    method = el.matches or el.mozMatchesSelector or el.msMatchesSelector or el.oMatchesSelector or el.webkitMatchesSelector
    method?.call(el, selector)


  closest: (el, selector) ->
    return null unless el
    if @matches(el, selector) then el else (el.querySelector(selector) or @closest(el.parentNode, selector))


}
