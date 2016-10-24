React = require 'react'
{BrowserRouter, Match, Miss} = require 'react-router'

{App} = require './app'

TutorRoot = React.createClass

  render: ->
    <BrowserRouter>
      <div className="tutor-root">
        <Match pattern="/" render={ (props) ->
          <App {...props} />
        } />
      </div>
    </BrowserRouter>

module.exports = TutorRoot
