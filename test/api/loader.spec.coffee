{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

$ = require 'jquery'


describe 'API loader', ->
  beforeEach ->
    @jquery =
      ajax: sinon.spy ->
        d = $.Deferred()
        _.defer -> d.resolve({})
        d.promise()
    delete require.cache[require.resolve('api')]
    delete require.cache[require.resolve('api/loader')]
    require.cache[require.resolve('jquery')].exports = @jquery
    @api = require 'api'
    @api.initialize('test/url')


  afterEach ->
    require.cache[require.resolve('jquery')].exports = $
    # force require to re-parse the api file now that the stub's removed
    delete require.cache[require.resolve('api/loader')]

  it 'sets isPending', (done) ->
    expect(@api.isPending()).to.be.false
    @api.channel.emit('user.status.send.fetch', data: {})
    _.delay( =>
      expect(@api.isPending()).to.be.true
    , 1)
    _.delay =>
      expect(@api.isPending()).to.be.false
      done()
    , 50 # longer than loader's isLocal delay

  it 'debounces calls to the same URL', (done) ->
    for i in [1..10]
      @api.channel.emit('user.status.send.fetch', data: {})
    _.delay =>
      expect(@jquery.ajax.callCount).equal(1)
      done()
    , 50
