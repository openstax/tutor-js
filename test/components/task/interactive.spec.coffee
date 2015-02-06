$ = require 'jquery'
{expect} = require 'chai'

React = require 'react'

{Interactive} = require '../../../src/components/all-steps'

describe 'Interactive Task', ->
  it 'should render an IFrame', ->
    model =
      type: 'reading'
      content_url: '/foo'

    html = React.renderComponentToString(<Interactive model={model} />)
    $node = $("<div id='wrapper'>#{html}</div>")

    # Verify the node has the correct elements
    expect($node.find('iframe')).to.have.length(1)
    expect($node.find('iframe[src="/foo"]')).to.have.length(1)
