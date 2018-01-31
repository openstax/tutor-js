jest.mock 'model/networking'
jest.mock 'loglevel'
jest.mock 'lodash/debounce', ->
  jest.fn(
    (fn) -> -> fn()
  )

debounce = require 'lodash/debounce'
Networking = require 'model/networking'
ConsoleLogger = require 'loglevel'

URLs = require 'model/urls'

Log = require 'helpers/logging'

jest.useFakeTimers()

describe 'Loggging', ->
  beforeEach ->
    @urls = {tutor_api_url: 'http://foo.bar.com/'}
    URLs.update(@urls)

  afterEach ->
    Log.clearPending()
    ConsoleLogger.error.mockClear()
    Networking.perform.mockClear()

  it 'logs messages', ->
    for level in Log.levels
      Log[level]("Testing #{level}")
      expect(ConsoleLogger[level]).toHaveBeenLastCalledWith("Testing #{level}")
    undefined

  it 'persists messages', ->
    msg = "here's your info"
    Log.info(msg, persist: true)
    expect(ConsoleLogger.info).toHaveBeenLastCalledWith(msg)
    jest.runAllTimers()
    expect(Networking.perform).toHaveBeenLastCalledWith(
      data: { entries: [{location: 'about:blank', level: 'info', message: msg}] },
      method: 'POST', url: 'http://foo.bar.com/log/entry'
    )

  it 'skips persisting if api host is missing', ->
    URLs.reset()
    msg = "a debug msg"
    Log.info(msg, persist: true)
    expect(ConsoleLogger.info).toHaveBeenLastCalledWith(msg)
    jest.runAllTimers()
    expect(Networking.perform).not.toHaveBeenCalled()
    undefined

  it 'defaults to persisting for warnings', ->
    msg = "bang() goes the err"
    Log.error(msg)
    expect(ConsoleLogger.error).toHaveBeenLastCalledWith(msg)
    jest.runAllTimers()

    expect(Networking.perform).toHaveBeenLastCalledWith(
      data: { entries: [{location: 'about:blank', level: 'error', message: msg}] },
      method: 'POST', url: 'http://foo.bar.com/log/entry'
    )

  it 'can override persist', ->
    msg = "warning you of things"
    Log.warn(msg, persist: false)
    expect(ConsoleLogger.warn).toHaveBeenLastCalledWith(msg)
    expect(Networking.perform).to.not.haveBeenCalled

  it 'transmits multiple messages together', ->
    for num in [1..10]
      Log.error("bang(#{num}) goes the err")
    expect(
      ConsoleLogger.error
    ).toHaveBeenCalledTimes(10)
    expect(debounce).toHaveBeenCalled()
    undefined
