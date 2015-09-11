{expect} = require 'chai'
_ = require 'underscore'

DOM  = require '../src/helpers/dom'

HTML = """
<div class="dc">
  <h1>heading</h1>
  <p class="para">
    first paragraph.
  </p>
  <div class="wfig">
    <figure>a figure</figure>
  </div>
  <div id="tutor-boostrap-data">
    {"user":{"name":"Atticus Finch"}}
  </div>
</div>
"""


describe 'DOM Helpers', ->

  beforeEach ->
    @root = document.createElement('div')
    @root.innerHTML = HTML
    @p = @root.querySelector('p.para')
    @figure = @root.querySelector('figure')

  it 'can query using closest', ->
    expect( DOM.closest( @p, '.dc' ).tagName ).to.equal('DIV')
    expect( DOM.closest( @figure, '.dc' ).tagName ).to.equal('DIV')
    expect( DOM.closest( @figure, 'div' ).className ).to.equal('wfig')

  it 'can find using closest when same element matches', ->
    expect( DOM.closest( @p, '.para' ).className ).to.equal('para')

  it 'returns null when not found', ->
    expect( DOM.closest( @p, 'img' ) ).to.be.null

  it 'does not find siblings', ->
    expect( DOM.closest( @p, '.wfig' ) ).to.be.null

  it 'can read bootstrap data', ->
    expect(DOM.readBootstrapData(@root)).to.deep.equal({"user":{"name":"Atticus Finch"}})
