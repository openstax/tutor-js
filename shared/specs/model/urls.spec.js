import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import URLs from 'model/urls';
describe('URLs', function() {

  beforeEach(function() {
    this.urls = { foo_url: 'http://foo.bar.com/' };
    return URLs.update(this.urls);
  });

  afterEach(() => URLs.reset());

  it('strips _url from keys', function() {
    expect( URLs.get('foo') ).to.equal( 'http://foo.bar.com' );
    return undefined;
  });

  it('can construct a url from parts', function() {
    expect( URLs.construct('foo', 'bar', 'baz', 1) )
      .to.equal( 'http://foo.bar.com/bar/baz/1' );
    return undefined;
  });

  it('only remembers keys that end in _url', function() {
    URLs.update({
      '1test_url': 'http://test.com',
      '2test':     'http://test.com',
    });
    expect( URLs.get('1test') ).to.equal('http://test.com');
    expect( URLs.get('2test') ).not.to.exist;
    return undefined;
  });

  return it('ignores non-string urls', function() {
    URLs.update({
      'object_url': { object: true },
      'number_url': 42,
    });
    expect( URLs.get('object') ).not.to.exist;
    expect( URLs.get('number') ).not.to.exist;
    return undefined;
  });
});
