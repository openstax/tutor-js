{Compiler, DOMHelper, hooks} = require('./htmlbars')

module.exports =
  # htmlSelectors: {'.foo': (config) -> config.stem}
  # htmlLeaveBlanks: {'.foo': true}

  domify: (source, data, leaveBlanks) ->
    unless leaveBlanks
      source = source.replace(/____(\d+)?/g, '<input type="text"/>')

    # Cache the template
    @_templates ?= {}
    @_templates[source] ?= Compiler.compile(source)
    template = @_templates[source]
    dom      = template(data, {hooks: hooks, dom: new DOMHelper()})
    dom

  componentDidMount: ->
    {config, state} = @props
    for selector, fn of @htmlSelectors or {}
      node = @getDOMNode().querySelector(selector)
      content = @domify(fn(config), state, @htmlLeaveBlanks?[selector])
      node.appendChild(content)
