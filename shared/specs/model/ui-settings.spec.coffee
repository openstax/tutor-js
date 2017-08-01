{sinon, _} = require 'shared/specs/helpers'
{ autorun } = require 'mobx';
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

  it 'can observe', ->
    initialSetting = {one: 18, two:'III', deep: {key: 'value', bar: 'bz'}}
    UiSettings.initialize(initialSetting)
    spy = jest.fn(-> UiSettings.get('deep', 'bar'))
    autorun(spy)
    expect(spy).toHaveBeenCalledTimes(1) # mobx fires two observed events per set; one for the insert
    UiSettings.set('deep', 'bar', 'foo') # and one for converting to observable object
    expect(spy).toHaveBeenCalledTimes(3)

  it 'can observe when bad values are present', ->
    initialSetting = { deep: {} }
    UiSettings.initialize(initialSetting)
    spy = jest.fn(-> UiSettings.get('deep', 'bar'))
    autorun(spy)
    expect(spy).toHaveBeenCalledTimes(1)
    UiSettings.set('deep', true)
    expect(spy).toHaveBeenCalledTimes(2)
    UiSettings.set('deep', 'bar', 'foo')
    expect(spy).toHaveBeenCalledTimes(3)
    obj = UiSettings.get('deep')
    expect(obj).toEqual({bar: 'foo'})
    obj.bar = 233
    expect(spy).toHaveBeenCalledTimes(4)
    UiSettings.set('deep', 'bar', [2, 3] )
    expect(spy).toHaveBeenCalledTimes(6)
    obj = UiSettings.get('deep', 'bar')
    expect(obj.toJS()).toEqual([2, 3])
