get = require 'lodash/get'

jasmine.addMatchers

  toHaveRendered: ->
    compare: (wrapper, selector) ->
      matchCount = wrapper.find(selector).length
      result = { pass: matchCount is 1 }
      if result.pass
        result.message =  ->"#{selector} was found"
      else
        result.message =  -> "Expected wrapper to contain `#{selector}` only once, but it was found #{matchCount} times"
      result



expect.extend({

  toHaveChanged: (fn, tests) ->
    failures = []
    utils = @utils

    testValue = (i, test, type, expected) ->
      actual = get(test.object, test.property, test.value?())
      actual = parseFloat(actual) unless typeof actual is 'number'

      if test.precision
        utils.ensureNumbers(actual, expected, "test index #{i}")
        pass = Math.abs(expected - actual) < Math.pow(10, -test.precision) / 2
        hint = utils.matcherHint('.toBeCloseTo')
      else
        pass = expected is actual
        hint = utils.matcherHint('.toEqual')

      name = test.property or i

      failures.push(
        "#{name}: #{type} #{hint}: #{utils.printExpected(expected)}, received #{utils.printReceived(actual)}"
      ) unless pass

    for test, i in tests
      testValue(i, test, 'from value', test.from)

    fn()

    for test, i in tests
      expected = if test.by? then (test.from + test.by) else test.to
      testValue(i, test, 'changed value', expected)

    if failures.length
      { pass: false, message: -> failures.join("\n") }
    else
      { pass: true, message: -> 'all matched' }

})
