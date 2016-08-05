installCustomImplementation = (test) ->
  timeout = test.timeout

  currentTimeout = 0
  testStartTime = Date.now()

  test.addTimeoutMs = (ms) ->
    test.timeout.extendFromNow(ms)
    # currentTimeout += ms
    # now = Date.now()
    # msFromNow = testStartTime + currentTimeout - now
    # msFromNow = Math.max(msFromNow, 60 * 1000) # Always make the timeout at least 60sec
    # if ms > 60 * 1000 # If we are extending more than the default 60sec the log it
    #   console.log "[Timeout extended by #{ms / 1000}sec]"
    # timeout.call(@, msFromNow, true) # The extra arg is isInternal for use in the overridden @timeout

  test.addTimeout = (sec) -> test.addTimeoutMs(sec * 1000)

  test.sleep = (ms, msg) ->
    throw new Error('BUG: A message is required for sleeping') unless msg
    test.driver.call ->
      console.log("Sleeping for #{ms}ms. DANGEROUS. USE AS A LAST RESORT!!! message: #{msg}")
      test.addTimeoutMs(ms * 2) # Add some extra ms just in case
      test.driver.sleep(ms)

  # replace selenium timeout with our custom implementation
  unless test.timeout.__ORIGINAL
    originalTimeout = test.timeout

    test.timeout = (ms, isInternal) ->
      unless isInternal
        throw new Error('use addTimeout (preferably in the helper you are using) instead of timeout')
      if ms
        timeout.call(@, ms, isInternal)
      else
        timeout.call(@)

    test.timeout.__ORIGINAL = originalTimeout # Only override once
    test.timeout.__START_TIME = testStartTime
    test.timeout.extendFromNow = (ms = 10 * 1000) ->
      originalTimeout.call(test, Date.now() - testStartTime + ms)


module.exports = {installCustomImplementation}
