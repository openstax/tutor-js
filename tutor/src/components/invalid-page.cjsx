React  = require 'react'
{Link} = require 'react-router'
BS = require 'react-bootstrap'
TutorRouter = require '../helpers/router'

InvalidPage = (props) ->
  {message} = props
  message ?= "#{props.location?.pathname} not found"

  <BS.Grid>
    <h1>
      Whoops, we do not have this page.
    </h1>
    <p>{message}</p>
    <Link to={TutorRouter.makePathname('listing')}>Home</Link>
  </BS.Grid>

module.exports = InvalidPage
