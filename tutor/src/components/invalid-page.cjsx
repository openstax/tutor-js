React  = require 'react'
{Link} = require 'react-router'
BS = require 'react-bootstrap'
TutorRouter = require '../helpers/router'
TutorButtonLink = require './button-link'

InvalidPage = (props) ->
  {message} = props
  message ?= "#{props.location?.pathname} not found"

  <BS.Grid>
    <h1>
      Whoops, we do not have this page.
    </h1>
    <p>{message}</p>
    <TutorButtonLink to='listing' bsStyle='primary'>Home</TutorButtonLink>
  </BS.Grid>

module.exports = InvalidPage
