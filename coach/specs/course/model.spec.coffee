{Testing, expect, sinon, _} = require 'shared/specs/helpers'

Course = require 'course/model'

AUTH_DATA = require '../../auth/status/GET'
ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT = require '../../api/enrollment_changes/POST'
ENROLLMENT_CHANGE_DATA_WITH_CONFLICT = require '../../api/enrollment_changes/POST_WITH_CONFLICT'

describe 'Course Model', ->

  describe 'from auth data', ->

    beforeEach ->
      @course = new Course(_.first(AUTH_DATA.courses))

    it 'can describe itself', ->
      expect(@course.description()).to.eq('Biology I 1st')
      undefined

    it 'gets the student record', ->
      expect(@course.getStudentIdentifier()).to.eq('1324')
      undefined

    it 'sets student id when registering', ->
      @course._onConfirmed(data: {student_identifier: 'ABCDEF'})
      expect(@course.getStudentIdentifier()).to.eq('ABCDEF')
      undefined

    it 'sets student id after modification is performed', ->
      @course._onStudentUpdated(data: {student_identifier: 'WXYZ'})
      expect(@course.getStudentIdentifier()).to.eq('WXYZ')
      undefined

    it 'translates error messages', ->
      @course.errors = [
        {code: 'already_enrolled'},
        {code: 'already_processed'}]
      expect(@course.errorMessages()).to.deep.equal([
        'You are already enrolled in this course.  ' +
        'Please verify the enrollment code and try again.',
        'Your enrollment in this course has been processed. Please reload the page.'])
      undefined

  describe 'from an EnrollmentChange data', ->

    beforeEach -> @course = new Course()

    it 'starts in an incomplete state', ->
      expect(@course.isIncomplete()).to.eq true
      undefined

    describe 'after the EnrollmentChange is created without conflicts', ->

      beforeEach -> @course._onRegistered(data: ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT)

      it 'is in a pending state', ->
        expect(@course.isConflicting()).to.eq false
        expect(@course.isPending()).to.eq true
        undefined

      it 'can describe itself', ->
        expect(@course.description()).to.eq('Physics I (section 1st)')
        undefined

      it 'can return teacher names', ->
        expect(@course.teacherNames()).to.eq('Instructors: Charles Morris and William Blake')
        undefined

      it 'does not have a student identifier', ->
        expect(@course.getStudentIdentifier()).to.be.undefined
        undefined

      it 'can get the EnrollmentChange id', ->
        expect(@course.getEnrollmentChangeId()).to.eq '1'
        undefined

      it 'translates error messages', ->
        @course.errors = [
          {code: 'already_enrolled'},
          {code: 'already_processed'}]
        expect(@course.errorMessages()).to.deep.equal([
          'You are already enrolled in this course.  ' +
          'Please verify the enrollment code and try again.',
          'Your enrollment in this course has been processed. Please reload the page.'])
        undefined

      describe 'after confirming', ->

        beforeEach -> @course._onConfirmed(data:
          _.extend(ENROLLMENT_CHANGE_DATA_WITHOUT_CONFLICT, student_identifier: 'S12345')
        )

        it 'is in a done state', ->
          expect(@course.isPending()).to.eq false
          undefined

        it 'can get the student identifier', ->
          expect(@course.getStudentIdentifier()).to.eq 'S12345'
          undefined

    describe 'after the EnrollmentChange is created with conflicts', ->

      beforeEach -> @course._onRegistered(data: ENROLLMENT_CHANGE_DATA_WITH_CONFLICT)

      it 'is in a conflict state', ->
        expect(@course.isConflicting()).to.eq true
        undefined

      it 'can describe itself', ->
        expect(@course.description()).to.eq(
          'from College Physics with Concept Coach (section 1st) ' +
          'to College Physics with Concept Coach II (section 2nd)'
        )
        undefined

      it 'can return teacher names', ->
        expect(@course.teacherNames()).to.eq('Instructor: William Blake')
        undefined

      it 'can describe the conflicts', ->
        expect(@course.conflictDescription()).to.eq(
          'College Physics with Concept Coach (section 1st)'
        )
        undefined

      it 'can return conflict teacher names', ->
        expect(@course.conflictTeacherNames()).to.eq('Instructor: Charles Morris')
        undefined

      describe 'after continuing from the conflict', ->

        beforeEach -> @course.conflictContinue()

        it 'is in a pending state', ->
          expect(@course.isConflicting()).to.eq false
          expect(@course.isPending()).to.eq true
          undefined

        it 'can describe itself', ->
          expect(@course.description()).to.eq(
            'from College Physics with Concept Coach (section 1st) ' +
            'to College Physics with Concept Coach II (section 2nd)'
          )
          undefined

        it 'can return teacher names', ->
          expect(@course.teacherNames()).to.eq('Instructor: William Blake')
          undefined

        it 'can describe the conflicts', ->
          expect(@course.conflictDescription()).to.eq(
            'College Physics with Concept Coach (section 1st)'
          )
          undefined

        it 'can return conflict teacher names', ->
          expect(@course.conflictTeacherNames()).to.eq('Instructor: Charles Morris')
          undefined

        it 'does not have a student identifier', ->
          expect(@course.getStudentIdentifier()).to.be.undefined
          undefined

        it 'can get the EnrollmentChange id', ->
          expect(@course.getEnrollmentChangeId()).to.eq '1'
          undefined

        it 'translates error messages', ->
          @course.errors = [
            {code: 'already_enrolled'},
            {code: 'already_processed'}]
          expect(@course.errorMessages()).to.deep.equal([
            'You are already enrolled in this course.  ' +
            'Please verify the enrollment code and try again.',
            'Your enrollment in this course has been processed. Please reload the page.'])
          undefined

        describe 'after confirming', ->

          beforeEach -> @course._onConfirmed(data:
            _.extend(ENROLLMENT_CHANGE_DATA_WITH_CONFLICT, student_identifier: 'S12345')
          )

          it 'is in a done state', ->
            expect(@course.isPending()).to.eq false
            undefined

          it 'can get the student identifier', ->
            expect(@course.getStudentIdentifier()).to.eq 'S12345'
            undefined
