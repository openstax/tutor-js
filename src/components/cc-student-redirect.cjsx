React = require 'react'
BS    = require 'react-bootstrap'
_     = require 'underscore'

{CurrentUserStore} = require '../flux/current-user'
{CourseStore}      = require '../flux/course'
LogoutLink         = require './navbar/logout'
CountdownRedirect  = require './countdown-redirect'

CCStudentRedirect = React.createClass
  contextTypes:
    router: React.PropTypes.func

  render: ->
    {courseId} = @context.router.getCurrentParams()
    course = CourseStore.get(courseId)

    <BS.Panel className="cc-student-redirect">
      <p>You are logged in as a student account {CurrentUserStore.getName()}.</p>
      <div className="countdown">
        <CountdownRedirect redirectType='assign'
          message = "You are being redirected to your Concept Coach textbook"
          destinationUrl={course.webview_url}
        /> <a className="go-now" href={course.webview_url}>Go Now ❱</a>
      </div>
      <ul>
        <LogoutLink label="Or logout now to access your instructor account." />
      </ul>
    </BS.Panel>

module.exports = CCStudentRedirect
