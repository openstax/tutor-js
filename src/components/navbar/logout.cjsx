React = require 'react'
{CurrentUserStore} = require '../../flux/current-user'

LOGOUT_URL = '/accounts/logout'
LOGOUT_URL_CC = '/accounts/logout?cc=true'

CSRF_Token = CurrentUserStore.getCSRFToken()

module.exports = React.createClass

  render: ->
    {className, children, isConceptCoach} = @props
    classes = []
    classes.push(className) if className
    classes = classes.join(' ')

    <form
      acceptCharset='UTF-8'
      action={if isConceptCoach then LOGOUT_URL_CC else LOGOUT_URL}
      className='-logout-form'
      method='post'>
      <input type='hidden' name='_method' value='delete'/>
      <input type='hidden' name='authenticity_token' value={CSRF_Token}/>
      <button className={classes} aria-label="Sign out">
        {children}
      </button>
    </form>
