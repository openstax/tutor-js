User = require('../models/user').default;

module.exports = {

  matches: (el, selector) ->
    method = el.matches or el.mozMatchesSelector or el.msMatchesSelector or el.oMatchesSelector or el.webkitMatchesSelector
    method?.call(el, selector)

  isParent: (parent, child, options = { matchSame: true }) ->
    return false unless parent and child
    return true if options.matchSame and parent is child
    node = child.parentNode
    while node
      return true if node is parent
      node = node.parentNode
    return false

  closest: (el, selector) ->
    return null unless el
    if @matches(el, selector) then el else @closest(el.parentNode, selector)

  read_csrf: ->
    document.querySelector('meta[name=csrf-token]')?.getAttribute('content')

  readBootstrapData: (root = document) ->
    el = root.querySelector('#tutor-boostrap-data')
    if el
      el.parentNode.removeChild(el)
      JSON.parse(el.textContent)
    else
      {}

}
