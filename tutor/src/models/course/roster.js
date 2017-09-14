import { filter } from 'lodash';
import {
  BaseModel, identifiedBy, field, hasMany, computed,
} from '../base';

import Teacher from './teacher';
import Student from './student';

@identifiedBy('course/roster')
export default class CourseRoster extends BaseModel {

  @field teach_url;

  @hasMany({ model: Teacher, inverseOf: 'roster' }) teachers;
  @hasMany({ model: Student, inverseOf: 'roster' }) students;

  constructor(course) {
    super();
    this.course = course;
  }


  fetch() {
    return { courseId: this.course.id };
  }

  studentsForPeriod(period) {
    return filter(this.students, { is_active: true, period_id: period.id });
  }

  @computed get droppedStudents() {
    return filter(this.students, { is_active: false });
  }
}
//
// // coffeelint: disable=no_empty_functions
// import { CrudConfig, makeSimpleStore, extendConfig, STATES } from './helpers';
// import { CourseListingActions } from './course-listing';
// import _ from 'underscore';
//
// const LOADED  = 'loaded';
//
// const DELETING = 'deleting';
// const DELETED = 'deleted';
//
// const UNDROPPING = 'undropping';
// const UNDROPPED = 'undropped';
//
//
// const RosterConfig = {
//   _changedStudentIds: {},
//   _asyncStatus: {},
//
//   create(courseId, params) {},
//
//   created(student, courseId) {
//     this._local[courseId].push(student);
//     return this.emitChange();
//   },
//
//   saved(newProps, studentId) {
//     this._asyncStatus[studentId] = LOADED;
//     // update the student from all the courses rosters
//     for (let courseId in this._local) {
//       const roster = this._local[courseId];
//       const { students } = roster;
//       const student = _.findWhere(students, { id: studentId });
//       if (student) { _.extend(student, newProps); }
//     }
//     this.emit(`saved:${studentId}`);
//     return this.emitChange();
//   },
//
//   delete(studentId) {
//     this._asyncStatus[studentId] = DELETING;
//     return this.emitChange();
//   },
//
//   deleted(unused, studentId) {
//     this._asyncStatus[studentId] = DELETED;
//     // set inactive
//     for (let courseId in this._local) {
//       const roster = this._local[courseId];
//       const { students } = roster;
//       const student = _.findWhere(students, { id: studentId });
//       __guard__(student, x => x.is_active = false);
//     }
//     return this.emitChange();
//   },
//
//   teacherDelete(teacherId, courseId, isCurrent) {
//     let roster, teacherIndex, teachers;
//     this._asyncStatus[teacherId] = DELETING;
//     for (courseId in this._local) {
//       roster = this._local[courseId];
//       ({ teachers } = roster);
//       teacherIndex = _.findIndex(teachers, { id: teacherId });
//     }
//     __guard__(roster.teachers, x => x.splice(teacherIndex, 1));
//     if (isCurrent) {
//       CourseListingActions.delete(courseId);
//     }
//     return this.emitChange();
//   },
//
//   teacherDeleted(unused, teacherId) {
//     this._asyncStatus[teacherId] = DELETED;
//     this.emitChange();
//     return this.emit(DELETED);
//   },
//
//   undrop({ studentId }) {
//     this._asyncStatus[studentId] = UNDROPPING;
//     return this.emitChange();
//   },
//
//   undropped(updatedStudent, { studentId }) {
//     this._asyncStatus[studentId] = UNDROPPED;
//     // set active
//     for (let courseId in this._local) {
//       const roster = this._local[courseId];
//       const { students } = roster;
//       const oldStudent = _.findWhere(students, { id: studentId });
//       _.extend(oldStudent, updatedStudent);
//     }
//     return this.emitChange();
//   },
//
//   setStudentIdentifier(courseId, studentId, identifier) {
//     this._changedStudentIds[studentId] = identifier;
//     delete this._errors[studentId];
//     return this.emitChange();
//   },
//
//   onUndropAlreadyActive({ studentId }, error, request) {
//     return this.undropped({ is_active: true }, { studentId });
//   },
//
//   saveStudentIdentifier({ courseId, studentId }) {
//     return this._asyncStatus[studentId] = STATES.SAVING;
//   },
//
//   savedStudentIdentifier(updatedStudent, { courseId, studentId }) {
//     const id = this._changedStudentIds[studentId];
//     delete this._changedStudentIds[studentId];
//     delete this._asyncStatus[studentId];
//     const oldStudent = _.findWhere(__guard__(this._get(courseId), x => x.students), { id: studentId });
//     if (oldStudent) { _.extend(oldStudent, updatedStudent); }
//     return this.emitChange();
//   },
//
//   recordDuplicateStudentIdError({ courseId, studentId }, error, request) {
//     this._errors[studentId] = error;
//     return this.emitChange();
//   },
//
//   exports: {
//
//     getStudentIdentifier(courseId, studentId) {
//       const changed = this._changedStudentIds[studentId];
//       if (changed != null) { return changed; } else {
//         return __guard__(_.findWhere(__guard__(this._get(courseId), x1 => x1.students), { id: studentId }), x => x.student_identifier);
//       }
//     },
//
//     hasChangedStudentIdentifier(studentId) {
//       return !!this._changedStudentIds[studentId];
//     },
//
//     getActiveStudentsForPeriod(courseId, periodId) {
//       return _.where(__guard__(this._get(courseId), x => x.students), { period_id: periodId, is_active: true });
//     },
//
//     getDroppedStudents(courseId, periodId) {
//       return _.where(__guard__(this._get(courseId), x => x.students), { period_id: periodId, is_active: false });
//     },
//
//     isDeleting(studentId) { return this._asyncStatus[studentId] === DELETING; },
//
//     isTeacherDeleting(teacherId) { return this._asyncStatus[teacherId] === DELETING; },
//
//     isUnDropping(studentId) { return this._asyncStatus[studentId] === UNDROPPING; },
//   },
//
// };
//
// extendConfig(RosterConfig, new CrudConfig());
// const { actions, store } = makeSimpleStore(RosterConfig);
// export { actions as RosterActions, store as RosterStore };
//
// function __guard__(value, transform) {
//   return (typeof value !== 'undefined' && value !== null) ? transform(value) : undefined;
// }
