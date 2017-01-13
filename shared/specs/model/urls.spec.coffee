{Testing, expect, sinon, _} = require 'shared/specs/helpers'

URLs = require 'model/urls'
describe 'URLs', ->

  beforeEach ->
    @urls = {foo_url: 'http://foo.bar.com/'}
    URLs.update(@urls)

  afterEach ->
    URLs.reset()

  it 'strips _url from keys', ->
    expect( URLs.get('foo') ).to.equal( 'http://foo.bar.com' )
    undefined

  it 'can construct a url from parts', ->
    expect( URLs.construct('foo', 'bar', 'baz', 1) )
      .to.equal( 'http://foo.bar.com/bar/baz/1' )
    undefined

  it 'only remembers keys that end in _url', ->
    URLs.update({
      '1test_url': 'http://test.com',
      '2test':     'http://test.com'
    })
    expect( URLs.get('1test') ).to.equal('http://test.com')
    expect( URLs.get('2test') ).not.to.exist
    undefined

  it 'ignores non-string urls', ->
    URLs.update({
      'object_url': {object: true}
      'number_url': 42
    })
    expect( URLs.get('object') ).not.to.exist
    expect( URLs.get('number') ).not.to.exist
    undefined
