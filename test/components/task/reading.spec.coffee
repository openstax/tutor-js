$ = require 'jquery'
{expect} = require 'chai'

React = require 'react'

{Reading} = require '../../../src/components/all-steps'

describe 'Reading Task', ->
  it 'should fetch the content from archive.cnx.org', (done) ->
    model =
      type: 'reading'
      content_url: 'http://archive.cnx.org/contents/3e1fc4c6-b090-47c1-8170-8578198cc3f0@8.html'
      content_html: '<div data-type="document-title">Experimental Design and Ethics</div>'

    $node = $("<div id='wrapper'></div>")
    React.renderComponent(<Reading model={model} />, $node[0])

    checkLoaded = ->
      expect($node.find('div[data-type="document-title"]').text()).to.equal('Experimental Design and Ethics')
      # TODO: Test that the image was actually loaded: $node.find('img[src]').attr('src')
      done()

    setTimeout(checkLoaded, 1900) # Mocha has a 2000ms limit for async tests by default
