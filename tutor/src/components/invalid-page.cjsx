React  = require 'react'
{Link} = require 'react-router'

InvalidPage = (props) ->
  <div>
    <h1>
      Woops, this is an invalid page
      {props.message or props.location.pathname}
    </h1>
    <Link to='dashboard'>Home</Link>
  </div>

module.exports = InvalidPage
