React = require 'react'
BS = require 'react-bootstrap'
_ = require 'underscore'

FAQ_BASE = 'http://openstax.force.com/support/articles/FAQ/'

CC_STUDENT_HELP = 'Getting-Started-with-Concept-Coach-Guide-Students/?q=getting+started&l=en_US&c=Products%3AConcept_Coach&fs=Search&pn=1'
CC_FACULTY_HELP = 'Getting-Started-with-Concept-Coach-Guide-Teachers/?q=getting+started&l=en_US&c=Products%3AConcept_Coach&fs=Search&pn=1'
TUTOR_STUDENT_HELP = 'Getting-Started-with-Tutor-Guide-Students/?q=getting+started&l=en_US&c=Products%3ATutor&fs=Search&pn=1'
TUTOR_FACULTY_HELP = 'Getting-Started-with-Tutor-Guide-Teachers/?q=getting+started&l=en_US&c=Products%3ATutor&fs=Search&pn=1'

EmptyCourses = React.createClass

  render: ->
    <BS.Panel
      className='-course-list-empty'
    >
      <p className="lead">
        We cannot find an OpenStax course associated with your account.
      </p>
      <p className="lead">
        <a target="_blank" href={"#{FAQ_BASE}#{CC_STUDENT_HELP}"}>
          Concept Coach Students.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={"#{FAQ_BASE}#{CC_FACULTY_HELP}"}>
          Concept Coach Faculty.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={"#{FAQ_BASE}#{TUTOR_STUDENT_HELP}"}>
          Tutor Students.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={"#{FAQ_BASE}#{TUTOR_FACULTY_HELP}"}>
          Tutor Instructors.  Get help >
        </a>
      </p>
    </BS.Panel>


module.exports = EmptyCourses
