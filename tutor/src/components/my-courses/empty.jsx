import React from 'react';
import { Panel } from 'react-bootstrap';

const FAQ_BASE = 'http://openstax.force.com/support/articles/FAQ/';
// coffeelint: disable=max_line_length
const CC_STUDENT_HELP = 'Getting-Started-with-Concept-Coach-Guide-Students/?q=getting+started&l=en_US&c=Products%3AConcept_Coach&fs=Search&pn=1';
const CC_FACULTY_HELP = 'Getting-Started-with-Concept-Coach-Guide-Teachers/?q=getting+started&l=en_US&c=Products%3AConcept_Coach&fs=Search&pn=1';
const TUTOR_STUDENT_HELP = 'Getting-Started-with-Tutor-Guide-Students/?q=getting+started&l=en_US&c=Products%3ATutor&fs=Search&pn=1';
const TUTOR_FACULTY_HELP = 'Getting-Started-with-Tutor-Guide-Teachers/?q=getting+started&l=en_US&c=Products%3ATutor&fs=Search&pn=1';
// coffeelint: enable=max_line_length

export default function EmptyCourses() {
  return (
    <Panel className="-course-list-empty">
      <p className="lead">
        We cannot find an OpenStax course associated with your account.
      </p>
      <p className="lead">
        <a target="_blank" href={`${FAQ_BASE}${CC_STUDENT_HELP}`}>
          Concept Coach Students.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={`${FAQ_BASE}${CC_FACULTY_HELP}`}>
          Concept Coach Faculty.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={`${FAQ_BASE}${TUTOR_STUDENT_HELP}`}>
          Tutor Students.  Get help >
        </a>
      </p>
      <p className="lead">
        <a target="_blank" href={`${FAQ_BASE}${TUTOR_FACULTY_HELP}`}>
          Tutor Instructors.  Get help >
        </a>
      </p>
    </Panel>
  );
}
