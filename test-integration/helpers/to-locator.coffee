module.exports = (locator) ->
  if typeof locator is 'string'
    console.warn("Please use {css: '#{locator}'} instead of just a string as the argument")
    {css: locator}
  else
    locator
