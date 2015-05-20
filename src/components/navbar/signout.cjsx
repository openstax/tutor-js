React = require 'react'

LOGOUT_URL = '/accounts/logout'

module.exports = React.createClass

  render: ->
    {className, children} = @props
    classes = []
    classes.push(className) if className
    classes = classes.join(' ')

    <form
      accept-charset='UTF-8'
      action={LOGOUT_URL}
      className='-logout-form'
      method='post'>
      <input type='hidden' name='_method' value='delete'/>
      <button className={classes} aria-label="Sign out">
        {children}
      </button>
    </form>
