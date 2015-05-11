katex = require 'katex'

DOM_HELPER = document.createElement('div')

module.exports =
  renderMath: ->
    for node in @getDOMNode().querySelectorAll('[data-math]:not(.loaded)')
      formula = node.getAttribute('data-math')

      # Divs with data-math should be rendered as a block
      isBlock = node.tagName.toLowerCase() in ['div']

      if isBlock
        formula = "\\displaystyle {#{formula}}"

      katex.render(formula, node)
      node.classList.add('loaded')

  sanitizeKatexHtml: (html) ->
    # Clean up the katex that was added
    DOM_HELPER.innerHTML = html.trim() # Useful later in the func for unwrapping
    for node in DOM_HELPER.querySelectorAll('[data-math]')
      formula = node.getAttribute('data-math')
      node.classList.remove('loaded')
      # Put the formula in the innerHTML because browsers like to remove empty span tags
      node.innerHTML = formula

    # if there is only 1 <div> child element then unwrap it instead.
    # That way we don't have a bunch of <div>123</div> answers
    if DOM_HELPER.childElementCount is 1 and DOM_HELPER.firstChild.tagName.toLowerCase() is 'div'
      html = DOM_HELPER.firstChild.innerHTML
    else
      html = DOM_HELPER.innerHTML
    DOM_HELPER.innerHTML = '' # for memory
    html

  componentDidMount:  -> @renderMath()
  componentDidUpdate: -> @renderMath()
