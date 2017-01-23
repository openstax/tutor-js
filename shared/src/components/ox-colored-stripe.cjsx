React  = require 'react'

OXColoredStripe = (props) ->
  <div className='ox-colored-stripe'>
    {for color in ['orange', 'blue', 'red', 'yellow', 'teal']
      <div key={color} className={color}></div>}
  </div>

OXColoredStripe.displayName = 'OXColoredStripe'

module.exports = OXColoredStripe
