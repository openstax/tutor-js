{sinon, _} = require 'shared/specs/helpers'

UiSettings = require 'model/ui-settings'
Networking = require 'model/networking'

jest.useFakeTimers();

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
    undefined

  it 'saves when set', ->
    initialSetting = {'one': 1, 'two':'II'}
    UiSettings.initialize(initialSetting)
    UiSettings.set(one: 'five')
    jest.runAllTimers()
    expect(Networking.perform).to.have.been.called
    expect(Networking.perform.lastCall.args[0].data?.ui_settings).to.eql(
      one: 'five', two: 'II'
    )
    undefined

  it 'groups saves together', ->
    initialSetting = {one: 18, two:'III', deep: {key: 'value', bar: 'bz'}}
    UiSettings.initialize(initialSetting)
    UiSettings.set(one: 'five')
    UiSettings.set(one: 'six', deep: {bar: 'foo'})
    UiSettings.set(one: 'seven')
    jest.runAllTimers()
    expect(Networking.perform).to.have.been.calledOnce

    expect(Networking.perform.lastCall.args[0].data?.ui_settings).to.eql(
      one: 'seven', two: 'III', deep: { bar: 'foo'}
    )
    undefined

  it 'can set with key and id', ->
    initialSetting = {one: 18, two:'III', deep: {key: 'value', bar: 'bz'}}
    UiSettings.initialize(initialSetting)
    expect(UiSettings.get('deep', 'bar')).to.eql('bz')
    UiSettings.set('deep', 42, 'answer')
    expect(UiSettings.get('deep', 'bar')).toEqual('bz')
    expect(UiSettings.get('deep', 'key')).toEqual('value')
    expect(UiSettings.get('deep', 42)).toEqual('answer')
    expect(UiSettings.get('deep')).toEqual({ 42: 'answer', key: 'value', bar: 'bz' })
    undefined
