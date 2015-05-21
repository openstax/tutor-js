React = require 'react'
{CurrentUserStore} = require '../../flux/current-user'

LOGOUT_URL = '/accounts/logout'
CSRF_Token = CurrentUserStore.getCSRFToken()

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
      <input type='hidden' name='authenticity_token' value={CSRF_Token}/>
      <button className={classes} aria-label="Sign out">
        {children}
      </button>
    </form>
