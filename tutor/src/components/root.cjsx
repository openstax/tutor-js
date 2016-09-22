React = require 'react'
{BrowserRouter, Match, Miss} = require 'react-router'

App = require './app'

InvalidPage = require './invalid-page'

TutorRoot = React.createClass

  render: ->
    <BrowserRouter>
      <div className="tutor-root">
        <Match pattern="/" render={ (props) ->
          <App {...props} />
        } />
        <Miss component={InvalidPage} />
      </div>
    </BrowserRouter>

module.exports = TutorRoot
