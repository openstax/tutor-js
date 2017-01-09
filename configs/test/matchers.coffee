jasmine.addMatchers

  toHaveRendered: ->
    compare: (wrapper, selector) ->
      matchCount = wrapper.find(selector).length
      result = { pass: matchCount is 1 }
      if result.pass
        result.message =  "#{selector} was found"
      else
        result.message =  "Expected wrapper to contain `#{selector}` only once, but it was found #{matchCount} times"
      result
