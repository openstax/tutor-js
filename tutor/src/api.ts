
import { r } from 'shared/api/request'

type ID = number | string

interface CourseId { courseId: ID }
interface PeriodId { periodId: ID }
interface StudentId { studentId: ID }
interface BookId { bookId: ID }

const Api = {

    getCourse:          r<CourseId>('GET', 'courses/{courseId}'),
    updateCourse:       r<CourseId>('POST', 'courses/{courseId}'),
    updateCoursePeriod: r<PeriodId>('POST', 'period/{periodId}'),

    saveOwnStudentId:   r<StudentId>('POST', 'students{studentId}'),
    saveStudentId:      r<CourseId>('POST', 'user/courses/{courseId}/student'),
    updateStudent:      r<StudentId>('POST', 'students{studentId}'),
    dropStudent:        r<StudentId>('DELETE', 'students/{studentId}'),
    unDropStudent:      r<StudentId>('POST', 'students/{studentId}/undrop'),

    fetchReferenceBook: r<BookId>('POST', 'ecosystems/{bookId}/readings')

}

export default Api


//     connectModelRead(ReferenceBookNode, 'fetchContent', {
//         pattern: 'ecosystems/{ecosystemId}/pages/{cnx_id}',
//         onSuccess: 'onContentFetchComplete',
//         onFail: 'onContentFetchFail',
//     });

//     // "User" is actually an instance, but connectModel works at the class level
//     connectModelRead(User.constructor, 'fetch',
//         { pattern: 'user' }
//     );
//     connectModelUpdate(User.constructor, 'saveTourView',
//         { pattern: 'user/tours/{id}' }
//     );

//     // notes
//     connectModelRead(Stats, 'fetch', {
//         url: '/stats', onSuccess: 'onLoaded',
//     });

//     // notes
//     connectModelUpdate(Note, 'save', {
//         onSuccess: 'onUpdated',
//         method() { return this.isNew ? 'POST' : 'PUT'; },
//         pattern() {
//             return this.isNew ? 'pages/{pageUuid}/notes' : 'notes/{id}';
//         },
//     });
//     connectModelDelete(Note, 'destroy', {
//         onSuccess: 'onDeleted',
//         pattern: 'notes/{id}',
//     });
//     connectModelRead(PageNotes, 'fetch', {
//         onSuccess: 'onLoaded',
//         pattern: 'pages/{pageUuid}/notes',
//     });
//     connectModelRead(Notes, 'fetchHighlightedPages', {
//         onSuccess: 'onHighlightedPagesLoaded',
//         pattern: 'books/{bookUuid}/highlighted_sections',
//     });



//     connectModelRead(UserTerms, 'fetch', { onSuccess: 'onLoaded', url: 'terms' });
//     connectModelUpdate(UserTerms, 'sign', { onSuccess: 'onSigned', pattern: 'terms/{ids}', method: 'PUT' });
//     connectModelUpdate(Survey, 'save',
//         { pattern: 'research_surveys/{id}' }
//     );
//     connectModelRead(Purchases.constructor, 'fetch', { onSuccess: 'onLoaded', url: 'purchases' });
//     connectModelUpdate(
//         Purchase,
//         'refund',
//         {
//             onSuccess: 'onRefunded',
//             pattern: 'purchases/{item_uuid}/refund',
//             method: 'PUT',
//             data() { return { survey: this.refund_survey }; },
//         },
//     );
//     connectModelCreate(
//         User.constructor,
//         'logEvent',
//         {
//             method: 'POST',
//             pattern: 'log/event/{category}/{code}',
//             data({ data }) { return { data }; },
//         },
//     );
//     connectModelRead(Offerings.constructor, 'fetch', { url: 'offerings', onSuccess: 'onLoaded' });

//     connectModelCreate(CourseCreate, 'save', { onSuccess: 'onCreated' });

//     connectModelUpdate(TeacherTaskGrade, 'save', {
//         method: 'PUT', pattern: 'steps/{task_step_id}/grade', onSuccess: 'onGraded',
//     });
//     connectModelRead(TeacherTaskPlans, 'fetch', {
//         pattern: 'courses/{course.id}/dashboard', onSuccess: 'onLoaded',
//         params({ startAt, endAt }) { return { start_at: startAt, end_at: endAt }; },
//     });

//     connectModelRead( PastTaskPlans, 'fetch', {
//         pattern: 'courses/{course.id}/plans', onSuccess: 'onLoaded',
//         params: { clone_status: 'unused_source' },
//     });

//     connectModelRead(ResponseValidation, 'validate',
//         { pattern: 'validate', onSuccess: 'onValidationComplete', onFail: 'onFailure',
//             timeout: 2000, // wait a max of 2 seconds
//         });



//     connectModelCreate(CourseEnroll, 'create', { url: 'enrollment', onSuccess: 'onEnrollmentCreate', onFail: 'setApiErrors' });
//     connectModelUpdate(
//         CourseEnroll,
//         'confirm',
//         {
//             pattern: 'enrollment/{id}/approve',
//             method: 'PUT',
//             onSuccess: 'onApiRequestComplete',
//             onFail: 'setApiErrors',
//         },
//     );

//     connectModelCreate(StudentTasks, 'practice', {
//         pattern: 'courses/{courseId}/practice',
//     });

//     connectModelRead(PracticeQuestions, 'fetch', {
//         pattern: 'courses/{courseId}/practice_questions',
//         onSuccess: 'onLoaded',
//     });
//     connectModelRead(PracticeQuestions, 'checkExisting', {
//         pattern: 'courses/{courseId}/practice/saved',
//         onSuccess: 'onFoundExistingPractice',
//     });
//     connectModelCreate(PracticeQuestion, 'save', {
//         method: 'POST',
//         pattern: 'courses/{courseId}/practice_questions',
//         onSuccess: 'onSaved',
//     });
//     connectModelDelete(PracticeQuestion, 'destroy', {
//         pattern: 'courses/{courseId}/practice_questions/{id}',
//         onSuccess: 'onDestroyed',
//     });

//     connectModelRead(StudentTask, 'fetch', {
//         onSuccess: 'onFetchComplete', onFail: 'setApiErrors', pattern: '/tasks/{id}',
//         query() { return { course_id: this.course.id }; },
//     });
//     connectModelUpdate(StudentTask, 'exit', {
//         method: 'PUT',
//         pattern: 'courses/{courseId}/practice/{id}/exit',
//         query() { return { courseId: this.course.id }; },
//     });
//     connectModelUpdate(StudentTaskStep, 'save', {
//         onSuccess: 'onAnswerSaved', onFail: 'setApiErrors', pattern: 'steps/{id}',
//         query() { return { task_id: this.task.id, course_id: this.task.course.id }; },
//     });

//     connectModelRead(StudentTaskStep, 'fetch', {
//         onSuccess: 'onLoaded', onFail: 'setApiErrors', pattern: 'steps/{id}',
//         query() { return { task_id: this.task.id, course_id: this.task.course.id }; },
//     });

//     connectModelRead(StudentTaskPlans, 'fetch', { onSuccess: 'onLoaded', pattern: 'courses/{courseId}/dashboard' });
//     connectModelDelete(StudentTaskPlan, 'hide', { onSuccess: 'onHidden', pattern: 'tasks/{id}' });

//     connectModelUpdate(Course, 'save', { pattern: 'courses/{id}', onSuccess: 'onApiRequestComplete' });
//     connectModelUpdate(Course,
//         'saveExerciseExclusion', { method: 'PUT', pattern: 'courses/{id}/exercises/exclude', onSuccess: 'onExerciseExcluded' }
//     );

//     connectModelCreate(Exercises.constructor,
//         'createExercise', { pattern: 'courses/{courseId}/exercises', onSuccess: 'onExerciseCreated' }
//     );

//     connectModelDelete(Exercises.constructor,
//         'deleteExercise', { pattern: 'courses/{courseId}/exercises/{exerciseNumber}', onSuccess: 'onExerciseDeleted' }
//     );

//     connectModelRead(CourseLMS, 'fetch', { pattern: 'lms/courses/{course.id}', onSuccess: 'onApiRequestComplete' });

//     connectModelUpdate(CoursePairLMS, 'save', { method: 'POST', pattern: 'lms/courses/{course.id}/pair', onSuccess: 'onPaired' });

//     connectModelUpdate(LmsPushScores, 'start', { method: 'PUT', pattern: 'lms/courses/{course.id}/push_scores', onSuccess: 'onStarted' });

//     connectModelRead(CourseRoster, 'fetch', { pattern: 'courses/{courseId}/roster', onSuccess: 'onApiRequestComplete' });

//     connectModelDelete(CourseTeacher, 'drop', { pattern: 'teachers/{id}', onSuccess: 'onDropped' });

//     connectModelCreate(Period, 'create', { pattern: 'courses/{courseId}/periods', onSuccess: 'afterCreate' });

//     connectModelUpdate(Period, 'createTeacherStudent', { method: 'PUT', pattern: 'periods/{id}/teacher_student', onSuccess: 'onCreateTeacherStudent' });

//     connectModelUpdate(Period, 'save', { pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete' });
//     connectModelDelete(Period, 'archive', { pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete' });
//     connectModelUpdate(Period, 'unarchive', { pattern: 'periods/{id}', onSuccess: 'onApiRequestComplete' });

//     connectModelRead(CourseScores, 'fetch',
//         { pattern: 'courses/{courseId}/performance', onSuccess: 'onFetchComplete' });

//     connectModelUpdate(TaskResult, 'acceptLate', { method: 'PUT', pattern: 'tasks/{id}/accept_late_work', onSuccess: 'onLateWorkAccepted' });

//     connectModelUpdate(TaskResult, 'rejectLate', { method: 'PUT', pattern: 'tasks/{id}/reject_late_work', onSuccess: 'onLateWorkRejected' });

//     connectModelRead(Job, 'requestJobStatus', { onSuccess: 'onJobUpdate', onFail: 'onJobUpdateFailure', pattern: 'jobs/{jobId}' });

//     connectModelCreate(ScoresExport, 'create', { onSuccess: 'onCreated', pattern: 'courses/{course.id}/performance/export' });

//     connectModelDelete(TeacherTaskPlan, 'destroy', { onSuccess: 'onDeleteComplete', pattern: 'plans/{id}' });
//     connectModelRead(TeacherTaskPlan, 'fetch', {
//         onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}',
//     });
//     connectModelRead(TaskPlanStats, 'fetch', {
//         onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}/stats',
//     });
//     connectModelUpdate(TeacherTaskPlan, 'save', { onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}' });
//     connectModelUpdate(TeacherTaskPlan, 'grantExtensions', { onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}' });
//     connectModelUpdate(TeacherTaskPlan, 'saveDroppedQuestions', { onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}' });

//     connectModelUpdate(TaskingPlan, 'publishScores', { method: 'PUT', onSuccess: 'onPublishScoresComplete', pattern: 'tasking_plans/{id}/grade' });

//     connectModelRead(TaskPlanStats, 'fetchReview', { onSuccess: 'onApiRequestComplete', pattern: 'plans/{id}/review' });

//     connectModelRead(TaskPlanScores, 'fetch', {
//         onSuccess: 'onApiRequestComplete',
//         pattern: 'plans/{id}/scores',
//     });

//     connectModelRead(Courses.constructor, 'fetch', { onSuccess: 'onLoaded', url: 'user/courses' });

//     connectModelRead(GradingTemplates, 'fetch', {
//         onSuccess: 'onLoaded',
//         pattern: 'courses/{courseId}/grading_templates',
//     });


//     connectModelRead(GradingTemplate, 'save', {
//         onSuccess: 'onSaved',
//         method() { return this.isNew ? 'POST' : 'PUT'; },
//         pattern() {
//             return this.isNew ?
//                 'courses/{courseId}/grading_templates' : 'grading_templates/{id}';
//         },
//     });

//     connectModelDelete(GradingTemplate, 'remove', {
//         pattern: 'grading_templates/{id}',
//         onSuccess: 'onRemoved',
//     });

//     connectModelCreate(
//         User.constructor,
//         'suggestSubject',
//         {
//             onSuccess: 'onSaved',
//             method: 'POST',
//             pattern: 'user/suggest',
//             data({ data }) { return { data }; },
//         },
//     );

// };


// export default {
//     boot: startAPI,
// };



// TODO: convert flux
//     connectRead(CourseGuideActions, { pattern: 'courses/{id}/guide' });

//     connectRead(PerformanceForecast.Student.actions, function(id) {
//         const course = Courses.get(id);
//         const params = {};
//         if (course && course.current_role_id) {
//             params.role_id = course.current_role_id;
//         }
//         return { url: `courses/${id}/guide`, params };
//     });
//     connectRead(PerformanceForecast.Teacher.actions, { pattern: 'courses/{id}/teacher_guide' });
//     connectRead(PerformanceForecast.TeacherStudent.actions, function(id, { roleId }) {
//         const url = `courses/${id}/guide/role/${roleId}`;
//         const data = { id, roleId };
//         return { url, data };
//     });

//     connectRead(ReferenceBookExerciseActions, { url(url) { return url; } });
//     connectModelRead(Exercises.constructor, 'fetch', { onSuccess: 'onLoaded' });
//     connectModelRead(Ecosystems.constructor, 'fetch', { onSuccess: 'onLoaded', url: 'ecosystems' });
