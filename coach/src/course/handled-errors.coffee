ERROR_MAP =
  invalid_enrollment_code: 'The provided enrollment code is not valid. Please verify the enrollment code and try again.'
  enrollment_code_does_not_match_book: 'The provided enrollment code matches a course but not for the current book. ' +
                                       'Please verify the enrollment code and try again.'
  already_enrolled: 'You are already enrolled in this course.  ' +
                                       'Please verify the enrollment code and try again.'
  multiple_roles: 'We currently do not support teacher accounts with multiple associated student enrollments.'
  dropped_student: 'You have been dropped from this course. Please speak to your instructor to rejoin.'
  already_processed: 'Your enrollment in this course has been processed. Please reload the page.'
  already_approved: 'Your enrollment in this course has been approved. Please reload the page.'
  already_rejected: 'Your request to enroll in this course has been rejected for an unknown reason. Please contact OpenStax support.'
  taken: 'The provided student ID has already been used in this course. Please try again or contact your instructor.'
  blank_student_identifier: 'The student ID field cannot be left blank. Please enter your student ID.'
  no_change: 'You have not changed the student ID.  Please enter your new student ID and try again.'
  'belongs to a course that has already ended': 'The course that this enrollment code belongs to has ended.'
  course_ended: "This Concept Coach course has ended. Click My Progress at the top of the next screen to access all previous work for this course."


module.exports = ERROR_MAP
