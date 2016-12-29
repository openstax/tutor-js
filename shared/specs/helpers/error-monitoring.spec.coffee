jest.mock 'helpers/logging'

Logging = require 'helpers/logging'

ErrorMonitoring = require 'helpers/error-monitoring'

describe 'Error Monitoring', ->

  beforeEach ->
    ErrorMonitoring.start()

  afterEach ->
    ErrorMonitoring.stop()

  it 'logs exceptions', ->

    try
      bangThisIsAnError()
    catch e
      window.onerror('bang!', 'foo', 22, 22, e)


    expect(Logging.error.mock.calls[0][0]).toMatch('bangThisIsAnError is not defined')

    new Promise (resolve) ->
      setTimeout( resolve, 3)
