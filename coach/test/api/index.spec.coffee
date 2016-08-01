{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

{loader, isPending} = require 'api/loader'
REAL_LOADER = loader

describe 'API', ->
  beforeEach ->
    @loader = sinon.spy()
    # make sure api's not already required
    delete require.cache[require.resolve('api')]
    # set up api/loader's exports to use our stubbed loader
    require.cache[require.resolve('api/loader')].exports = {loader: @loader, isPending}
    # and now require api, which will in turn require api/loader with our stub
    @api = require 'api'

  afterEach ->
    require.cache[require.resolve('api/loader')].exports = {loader: REAL_LOADER, isPending}
    # force require to re-parse the api file now that the stub's removed
    delete require.cache[require.resolve('api')]
    @api.initialize('/')

  it 'only calls loader a single time', ->
    @api.initialize('/')
    expect(@loader.callCount).equal(1)
    @api.initialize('/')
    expect(@loader.callCount).equal(1)

  it 'can be re-initialized after destroy', ->
    @api.initialize('/')
    expect(@loader.callCount).equal(1)
    @api.destroy()
    @api.initialize('/')
    expect(@loader.callCount).equal(2)
