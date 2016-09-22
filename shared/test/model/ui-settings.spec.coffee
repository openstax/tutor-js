{Testing, expect, sinon, _} = require 'test/helpers'

UiSettings = require 'model/ui-settings'
Networking = require 'model/networking'

describe 'UiSettings', ->

  beforeEach ->
    sinon.stub(Networking, 'perform').returns(
      then: (fn) -> fn({})
    )


  afterEach ->
    UiSettings._reset()
    Networking.perform.restore()

  it 'remembers initialized values', ->
    UiSettings.initialize('one': 1, 'two':'II')
    expect(UiSettings.get('one')).to.equal(1)
    expect(UiSettings.get('two')).to.equal('II')

  it 'saves when set', (done) ->
    initialSetting = {'one': 1, 'two':'II'}
    UiSettings.initialize(initialSetting)
    UiSettings.set(one: 'five')
    _.delay( ->
      expect(Networking.perform).to.have.been.called
      expect(Networking.perform.lastCall.args[0].data?.previous_ui_settings).to.eql(initialSetting)
      expect(Networking.perform.lastCall.args[0].data?.ui_settings).to.eql(
        one: 'five', two: 'II'
      )
      done()
    , 20)

  it 'groups saves together', (done) ->
    initialSetting = {one: 18, two:'III', deep: {key: 'value', bar: 'bz'}}
    UiSettings.initialize(initialSetting)
    UiSettings.set(one: 'five')
    UiSettings.set(one: 'six', deep: {bar: 'foo'})
    UiSettings.set(one: 'seven')
    _.delay( ->
      expect(Networking.perform).to.have.been.calledOnce
      expect(Networking.perform.lastCall.args[0].data?.ui_settings).to.eql(
        one: 'seven', two: 'III', deep: {key: 'value', bar: 'foo'}
      )
      done()
    , 20)
