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
