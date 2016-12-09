{Testing, expect, sinon, _} = require 'shared/specs/helpers'

{CourseEnrollmentActions, CourseEnrollmentStore} = require 'flux/course-enrollment'

ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT = require '../../api/enrollment_changes/POST'
ENROLLMENT_CHANGE_DATA_WITH_CONFLICT = require '../../api/enrollment_changes/POST_WITH_CONFLICT'

describe 'EnrollmentChange Store', ->

  describe 'before the EnrollmentChange is created', ->

    beforeEach -> CourseEnrollmentActions.create()

    it 'is in a loading state', ->
      expect(CourseEnrollmentStore.isLoading()).to.eq true
      undefined

  describe 'after the EnrollmentChange is created without conflicts', ->

    beforeEach -> CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT)

    it 'is in a pending state', ->
      expect(CourseEnrollmentStore.isConflicting()).to.eq false
      expect(CourseEnrollmentStore.isPending()).to.eq true
      undefined

    it 'can describe itself', ->
      expect(CourseEnrollmentStore.description()).to.eq('Physics with Courseware (section 1st)')
      undefined

    it 'can return teacher names', ->
      expect(CourseEnrollmentStore.teacherNames()).to.eq(
        'Instructors: Charles Morris and William Blake'
      )
      undefined

    it 'does not have a student identifier', ->
      expect(CourseEnrollmentStore.getStudentIdentifier()).to.eq ''
      undefined

    it 'can get the EnrollmentChange id', ->
      expect(CourseEnrollmentStore.getEnrollmentChangeId()).to.eq '1'
      undefined

    it 'translates error messages', ->
      CourseEnrollmentActions.created(errors: [
        {code: 'already_enrolled'}, {code: 'already_processed'}])
      expect(CourseEnrollmentStore.errorMessages()).to.deep.equal([
        'You are already enrolled in this course.  ' +
        'Please verify the enrollment code and try again.',
        'Your enrollment in this course has been processed. Please reload the page.'])
      undefined

    describe 'after confirming', ->

      beforeEach -> CourseEnrollmentActions.confirmed(_.extend(
        ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT, student_identifier: 'S12345', status: 'approved'))

      it 'is in a done state', ->
        expect(CourseEnrollmentStore.isPending()).to.eq false
        undefined

      it 'can get the student identifier', ->
        expect(CourseEnrollmentStore.getStudentIdentifier()).to.eq 'S12345'
        undefined

  describe 'after the EnrollmentChange is created with conflicts', ->

    beforeEach -> CourseEnrollmentActions.created(ENROLLMENT_CHANGE_DATA_WITH_CONFLICT)

    it 'is in a conflict state', ->
      expect(CourseEnrollmentStore.isConflicting()).to.eq true
      undefined

    it 'can describe itself', ->
      expect(CourseEnrollmentStore.description()).to.eq(
        'from College Physics with Concept Coach (section 1st) ' +
        'to College Physics with Concept Coach II (section 2nd)'
      )
      undefined

    it 'can return teacher names', ->
      expect(CourseEnrollmentStore.teacherNames()).to.eq('Instructor: William Blake')
      undefined

    it 'can describe the conflicts', ->
      expect(CourseEnrollmentStore.conflictDescription()).to.eq(
        'College Physics with Concept Coach (section 1st)'
      )
      undefined

    it 'can return conflict teacher names', ->
      expect(CourseEnrollmentStore.conflictTeacherNames()).to.eq('Instructor: Charles Morris')
      undefined

    describe 'after continuing from the conflict', ->

      beforeEach -> CourseEnrollmentActions.conflictContinue()

      it 'is in a pending state', ->
        expect(CourseEnrollmentStore.isConflicting()).to.eq false
        expect(CourseEnrollmentStore.isPending()).to.eq true
        undefined

      it 'can describe itself', ->
        expect(CourseEnrollmentStore.description()).to.eq(
          'from College Physics with Concept Coach (section 1st) ' +
          'to College Physics with Concept Coach II (section 2nd)'
        )
        undefined

      it 'can return teacher names', ->
        expect(CourseEnrollmentStore.teacherNames()).to.eq('Instructor: William Blake')
        undefined

      it 'can describe the conflicts', ->
        expect(CourseEnrollmentStore.conflictDescription()).to.eq(
          'College Physics with Concept Coach (section 1st)'
        )
        undefined

      it 'can return conflict teacher names', ->
        expect(CourseEnrollmentStore.conflictTeacherNames()).to.eq('Instructor: Charles Morris')
        undefined

      it 'does not have a student identifier', ->
        expect(CourseEnrollmentStore.getStudentIdentifier()).to.eq ''
        undefined

      it 'can get the EnrollmentChange id', ->
        expect(CourseEnrollmentStore.getEnrollmentChangeId()).to.eq '1'
        undefined

      it 'translates error messages', ->
        CourseEnrollmentActions.created(errors: [
          {code: 'already_enrolled'}, {code: 'already_processed'}])
        expect(CourseEnrollmentStore.errorMessages()).to.deep.equal([
          'You are already enrolled in this course.  ' +
          'Please verify the enrollment code and try again.',
          'Your enrollment in this course has been processed. Please reload the page.'])
        undefined

      describe 'after confirming', ->

        beforeEach -> CourseEnrollmentActions.confirmed(_.extend(
          ENROLLMENT_CHANGE_DATA_WITH_CONFLICT, student_identifier: 'S12345', status: 'approved'))

        it 'is in a done state', ->
          expect(CourseEnrollmentStore.isPending()).to.eq false
          undefined

        it 'can get the student identifier', ->
          expect(CourseEnrollmentStore.getStudentIdentifier()).to.eq 'S12345'
          undefined
