{Testing, expect, sinon, _} = require 'test/helpers'

UiSettings = require 'model/ui-settings'
Networking = require 'model/networking'

describe 'UiSettings', ->

  beforeEach ->
    sinon.stub(Networking, 'perform')

  afterEach ->
    UiSettings._reset()
    Networking.perform.restore()

  it 'remembers initialized values', ->
    UiSettings.initialize('one': 1, 'two':'II')
    expect(UiSettings.get('one')).to.equal(1)
    expect(UiSettings.get('two')).to.equal('II')

  it 'saves when set', (done) ->
    UiSettings.initialize('one': 1, 'two':'II')
    UiSettings.set(one: 'five')
    _.delay( ->
      expect(Networking.perform).to.have.been.called
      expect(Networking.perform.lastCall.args[0].data?.ui_settings).to.eql(
        one: 'five', two: 'II'
      )
      done()
    , 2)
