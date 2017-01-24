React  = require 'react'
{Link} = require 'react-router'
BS = require 'react-bootstrap'
Icon = require './icon'
TutorRouter = require '../helpers/router'
TutorLink = require './link'

OXColoredStripe = require 'shared/src/components/ox-colored-stripe'

InvalidPage = (props) ->
  {message} = props
  message ?= "Kudos on your desire to explore! Unfortunately, we don't have a page to go with that particular location."

  <div className="invalid-page">
    <OXColoredStripe />
    <h1>
      Uh-oh, no page here
    </h1>
    <p>{message}</p>
    <TutorLink className="home" to='listing' bsStyle='primary'>
      Return Home
      <Icon type='caret-right' />
    </TutorLink>
  </div>

module.exports = InvalidPage
