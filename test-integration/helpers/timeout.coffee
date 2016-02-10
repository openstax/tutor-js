installCustomImplementation = (test) ->
  timeout = test.timeout

  currentTimeout = 0
  testStartTime = Date.now()

  test.addTimeoutMs = (ms) ->
    currentTimeout += ms
    now = Date.now()
    msFromNow = testStartTime + currentTimeout - now
    msFromNow = Math.max(msFromNow, 60 * 1000) # Always make the timeout at least 60sec
    if ms > 60 * 1000 # If we are extending more than the default 60sec the log it
      console.log "[Timeout extended by #{ms / 1000}sec]"
    timeout.call(@, msFromNow, true) # The extra arg is isInternal for use in the overridden @timeout

  test.addTimeout = (sec) -> test.addTimeoutMs(sec * 1000)

  test.sleep = (ms) ->
    test.driver.call ->
      test.addTimeoutMs(ms * 2) # Add some extra ms just in case
      test.driver.sleep(ms)

  # replace selenium timeout with our custom implementation
  test.timeout = (ms, isInternal) ->
    unless isInternal
      throw new Error('use addTimeout (preferably in the helper you are using) instead of timeout')
    if ms
      timeout.call(@, ms, isInternal)
    else
      timeout.call(@)


module.exports = {installCustomImplementation}
