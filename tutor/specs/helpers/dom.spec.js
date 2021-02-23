import DOM from '../../src/helpers/dom';

const HTML = `\
<div class="dc">
  <h1>heading</h1>
  <p class="para">
    first paragraph.
  </p>
  <div class="wfig">
    <figure>a figure</figure>
  </div>
</div>\
`;

describe('DOM Helpers', function() {
  let root, figure, p;

  beforeEach(function() {
    root = document.createElement('div');
    root.innerHTML = HTML;
    p = root.querySelector('p.para');
    figure = root.querySelector('figure');
  });

  it('can query using closest', function() {
    expect( DOM(p).closest('.dc' ).tagName ).toEqual('DIV');
    expect( DOM(figure).closest('.dc' ).tagName ).toEqual('DIV');
    expect( DOM(figure).closest('div').className ).toEqual('wfig');
  });

  it('can find using closest when same element matches', function() {
    expect( DOM(p).closest( '.para' ).className ).toEqual('para');
  });

  it('returns null when not found', function() {
    expect( DOM(p).closest( 'img' ) ).toBeNull();
  });

  it('does not find siblings', function() {
    expect( DOM(p).closest( '.wfig' ) ).toBeNull();
  });

});
