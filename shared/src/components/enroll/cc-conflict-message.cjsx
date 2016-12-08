React = require 'react'

CcConflictMessage = React.createClass

  propTypes:
    courseEnrollmentStore: React.PropTypes.shape(
      conflictDescription: React.PropTypes.func.isRequired
      conflictTeacherNames: React.PropTypes.func.isRequired
    ).isRequired

  render: ->
    <span>
      We will remove you from {@props.courseEnrollmentStore.conflictDescription()} with{' '}
      {@props.courseEnrollmentStore.conflictTeacherNames()}. If you want to stay enrolled{' '}
      in the OpenStax Concept Coach for that course,{' '}
      <a
      href="http://openstax.force.com/support/?cu=1&fs=ContactUs&l=en_US&c=Products%3AConcept_Coach&q">
        contact us.
      </a>
    </span>


module.exports = CcConflictMessage
