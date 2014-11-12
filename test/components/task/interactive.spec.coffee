$ = require 'jquery'
{expect} = require 'chai'

React = require 'react'

{InteractiveTask} = require '../../../src/components/tasks'

describe 'Interactive Task', ->
  it 'should render an IFrame', ->
    config =
      type: 'reading'
      content_url: '/foo'

    html = React.renderComponentToString(<InteractiveTask task={config} />)
    $node = $("<div id='wrapper'>#{html}</div>")

    # Verify the node has the correct elements
    expect($node.find('iframe')).to.have.length(1)
    expect($node.find('iframe[src="/foo"]')).to.have.length(1)
