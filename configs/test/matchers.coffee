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



expect.extend({

  toHaveChanged: (fn, tests) ->
    failures = []
    utils = @utils
    testValue = (i, type, expected, actual) ->
      if test.precision
        utils.ensureNumbers(actual, expected, "test index #{i}")
        pass = Math.abs(expected - actual) < Math.pow(10, -test.precision) / 2
        hint = utils.matcherHint('.toBeCloseTo')
      else
        pass = expected is actual
        hint = utils.matcherHint('.toEqual')
      failures.push(
        "test #{i} #{type} #{hint}: #{utils.printExpected(expected)}, received #{utils.printReceived(actual)}"
      ) unless pass

    testValue(i, 'from value', test.from, test.value()) for test, i in tests

    fn()

    for test, i in tests
      expected = if test.by? then (test.from + test.by) else test.to
      testValue(i, 'changed value', expected, test.value())

    if failures.length
      { pass: false, message: failures.join("\n") }
    else
      { pass: true, message: 'all matched' }

})
