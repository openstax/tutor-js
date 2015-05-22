{expect} = require 'chai'

{TimeActions, TimeStore} = require '../src/flux/time'

SERVER_TIME = new Date('2000-02-02')
LOCAL_TIME = new Date('2011-11-11')

describe 'Server Time', ->

  it 'returns the server time', ->
    TimeActions.setNow(SERVER_TIME, LOCAL_TIME)
    time = TimeStore.getNow(LOCAL_TIME)
    # Use strings so millisecs do not matter
    expect("#{time}").to.equal("#{SERVER_TIME}")

  it 'prevents invalid dates from being set', ->
    today = TimeStore.getNow().toDateString()
    TimeActions.setFromString("an invalid date")
    expect(TimeStore.getNow().toDateString()).to.equal(today)

  it 'can be set from string', ->
    now = new Date()
    TimeActions.setFromString('Thu Nov 10 2011 18:00:00 GMT-0600 (CST)', now)
    time = TimeStore.getNow(now)
    expect(time.toDateString()).to.equal('Thu Nov 10 2011')
